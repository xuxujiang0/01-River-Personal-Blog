# Web版“坦克大战”企业级移动端重构架构设计

## 1. 核心架构目标
将现有的基于键盘的单向输入模型，重构为支持高并发多点触控的双摇杆（Dual-Stick）移动端操作体系。实现真正的“边走边打”（独立底盘移动与炮塔瞄准），并提供媲美原生AAA手游的触控响应与视觉适配。

## 2. 多点触控状态机 (Multi-Touch State Machine)
为了彻底解决按键冲突和事件丢失，必须放弃传统的 `click` 或简单的 `pointerdown`，转而使用底层的 `Touch API`。

### 2.1 触摸标识符追踪 (Touch Identifier Tracking)
原生 `TouchEvent` 包含 `changedTouches`。我们将维护一个 `ActiveTouches` 字典，以 `touch.identifier` 为键。
- **左半屏 (x < screenWidth / 2)**: 分配给移动摇杆 (Movement Joystick)。
- **右半屏 (x >= screenWidth / 2)**: 分配给射击摇杆 (Aim/Shoot Joystick) 和动作按键 (Action Buttons)。

### 2.2 生命周期管理
- `touchstart`: 记录初始坐标 $(x_0, y_0)$，绑定 `identifier` 到特定摇杆，激活摇杆UI。
- `touchmove`: 计算当前坐标 $(x, y)$ 与初始坐标的偏移向量 $\vec{V} = (x - x_0, y - y_0)$。
- `touchend` / `touchcancel`: 释放对应的 `identifier`，摇杆归位，触发相应的结束事件（如停止射击）。

## 3. 摇杆数学向量计算模型

### 3.1 坐标归一化与径向边界钳制 (Radial Boundary Clamping)
设摇杆最大活动半径为 $R_{max}$，当前偏移向量为 $\vec{V} = (dx, dy)$。
1. 计算向量模长（距离）: $D = \sqrt{dx^2 + dy^2}$
2. **动态死区过滤 (Deadzone)**: 如果 $D < R_{dead}$，则视为无输入，避免手指微颤导致误触。
3. **径向钳制**: 如果 $D > R_{max}$，则将向量限制在圆周上：
   $$ dx' = \frac{dx}{D} \times R_{max} $$
   $$ dy' = \frac{dy}{D} \times R_{max} $$
4. **归一化输出**: 输出范围在 $[-1, 1]$ 的向量 $\vec{U} = (\frac{dx'}{R_{max}}, \frac{dy'}{R_{max}})$。

### 3.2 三角函数映射与双角分离
- **底盘移动角度 (Chassis Angle)**: $\theta_{move} = \text{atan2}(U_y, U_x)$
- **炮塔瞄准角度 (Turret Angle)**: $\theta_{aim} = \text{atan2}(S_y, S_x)$ （$S$ 为射击摇杆归一化向量）
- **平滑插值 (Smooth Interpolation)**: 坦克底盘旋转不应瞬间突变，应使用线性插值 (Lerp) 或球面线性插值 (Slerp) 平滑过渡到目标角度。

## 4. 全局视口与浏览器行为规范化

### 4.1 CSS 严格拦截
```css
.game-container {
  touch-action: none; /* 禁用所有默认触摸行为（滚动、缩放） */
  user-select: none; /* 禁用文本选择 */
  -webkit-user-select: none;
  -webkit-touch-callout: none; /* 禁用长按菜单 */
  overscroll-behavior: none; /* 禁用 iOS 橡皮筋回弹 */
}
```

### 4.2 动态视口缩放算法 (ResizeObserver)
监听容器尺寸变化，计算最佳缩放比 (Scale Factor)，确保游戏画布在任何宽高比（如 19.5:9 刘海屏）下都能等比缩放并绝对居中（Letterboxing / Pillarboxing）。
- 逻辑分辨率: $W_{logical} \times H_{logical}$ (例如 1920x1080)
- 物理分辨率: $W_{physical} \times H_{physical}$
- $Scale = \min(\frac{W_{physical}}{W_{logical}}, \frac{H_{physical}}{H_{logical}})$

## 5. 核心代码重构模块划分
1. `TouchController.ts`: 独立的多点触控分离引擎。
2. `Joystick.tsx`: 可复用的虚拟摇杆 React 组件（负责 UI 渲染与动画）。
3. `tank.ts` (Refactor): 引入 `turretAngle`，分离底盘与炮塔的渲染和逻辑。
4. `engine.ts` (Refactor): 接入 `TouchController` 的归一化向量，驱动游戏主循环。
5. `index.tsx` (Refactor): 整合 UI 层，实现横竖屏侦测与安全区适配。

```mermaid
graph TD
    A[Touch Events] -->|touchstart/move/end| B(TouchController)
    B -->|Left Screen| C[Movement Vector -1 to 1]
    B -->|Right Screen| D[Aim Vector -1 to 1]
    B -->|Right Screen| E[Action Buttons]
    
    C --> F[PlayerTank.update]
    D --> F
    E --> F
    
    F -->|Update Chassis Angle & Pos| G[Game Engine Loop]
    F -->|Update Turret Angle & Shoot| G
    
    G --> H[Canvas Render]
    
    I[ResizeObserver] -->|Calculate Scale & Offset| J[Viewport Manager]
    J --> H
    J --> K[UI Overlay Anchor Update]