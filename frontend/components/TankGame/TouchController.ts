export interface Vector2 {
    x: number;
    y: number;
}

export interface JoystickState {
    active: boolean;
    origin: Vector2;
    current: Vector2;
    vector: Vector2; // Normalized vector [-1, 1]
}

export class TouchController {
    private element: HTMLElement;
    private canvas: HTMLCanvasElement;
    private getScale: () => number;
    private getIsPortrait: () => boolean;
    
    // State
    public leftJoystick: JoystickState = { active: false, origin: { x: 0, y: 0 }, current: { x: 0, y: 0 }, vector: { x: 0, y: 0 } };
    public rightJoystick: JoystickState = { active: false, origin: { x: 0, y: 0 }, current: { x: 0, y: 0 }, vector: { x: 0, y: 0 } };
    public isShooting: boolean = false;

    // Touch Identifiers
    private leftTouchId: number | null = null;
    private rightTouchId: number | null = null;

    // Config
    private maxRadius: number = 60; // Max distance for joystick
    private deadzone: number = 10;  // Deadzone to ignore small movements

    constructor(element: HTMLElement, canvas: HTMLCanvasElement, getScale: () => number = () => 1, getIsPortrait: () => boolean = () => false) {
        this.element = element;
        this.canvas = canvas;
        this.getScale = getScale;
        this.getIsPortrait = getIsPortrait;
        this.bindEvents();
    }

    private bindEvents() {
        this.element.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.element.addEventListener('touchend', this.handleTouchEnd, { passive: false });
        this.element.addEventListener('touchcancel', this.handleTouchEnd, { passive: false });
    }

    public destroy() {
        this.element.removeEventListener('touchstart', this.handleTouchStart);
        this.element.removeEventListener('touchmove', this.handleTouchMove);
        this.element.removeEventListener('touchend', this.handleTouchEnd);
        this.element.removeEventListener('touchcancel', this.handleTouchEnd);
    }

    private getLogicalPos(touch: Touch): Vector2 {
        const rect = this.element.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        // Vector from center to touch point in screen space
        const vx = touch.clientX - cx;
        const vy = touch.clientY - cy;
        
        const isPortrait = this.getIsPortrait();
        const scale = this.getScale();
        
        let lx, ly;
        if (isPortrait) {
            // Rotate -90 degrees to map screen to logical canvas
            lx = vy;
            ly = -vx;
        } else {
            lx = vx;
            ly = vy;
        }
        
        // Map to dynamic logical space
        return {
            x: (lx / scale) + this.canvas.width / 2,
            y: (ly / scale) + this.canvas.height / 2
        };
    }

    private handleTouchStart = (e: TouchEvent) => {
        // 允许点击按钮等 UI 元素
        if (e.target instanceof HTMLElement && e.target.closest('button')) {
            return;
        }
        
        e.preventDefault(); // Prevent default browser behaviors
        
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const pos = this.getLogicalPos(touch);
            
            // In logical space, left half is x < canvas.width / 2
            const isLeft = pos.x < this.canvas.width / 2;

            if (isLeft && this.leftTouchId === null) {
                // Left half screen -> Movement Joystick
                this.leftTouchId = touch.identifier;
                this.leftJoystick.active = true;
                this.leftJoystick.origin = { ...pos };
                this.leftJoystick.current = { ...pos };
                this.leftJoystick.vector = { x: 0, y: 0 };
            } else if (!isLeft && this.rightTouchId === null) {
                // Right half screen -> Aim/Shoot Joystick
                this.rightTouchId = touch.identifier;
                this.rightJoystick.active = true;
                this.rightJoystick.origin = { ...pos };
                this.rightJoystick.current = { ...pos };
                this.rightJoystick.vector = { x: 0, y: 0 };
                this.isShooting = true; // Start shooting when right joystick is active
            }
        }
    };

    private handleTouchMove = (e: TouchEvent) => {
        if (e.target instanceof HTMLElement && e.target.closest('button')) {
            return;
        }
        e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const pos = this.getLogicalPos(touch);

            if (touch.identifier === this.leftTouchId) {
                this.updateJoystick(this.leftJoystick, pos.x, pos.y);
            } else if (touch.identifier === this.rightTouchId) {
                this.updateJoystick(this.rightJoystick, pos.x, pos.y);
            }
        }
    };

    private handleTouchEnd = (e: TouchEvent) => {
        if (e.target instanceof HTMLElement && e.target.closest('button')) {
            return;
        }
        e.preventDefault();

        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];

            if (touch.identifier === this.leftTouchId) {
                this.leftTouchId = null;
                this.leftJoystick.active = false;
                this.leftJoystick.vector = { x: 0, y: 0 };
            } else if (touch.identifier === this.rightTouchId) {
                this.rightTouchId = null;
                this.rightJoystick.active = false;
                this.rightJoystick.vector = { x: 0, y: 0 };
                this.isShooting = false;
            }
        }
    };

    private updateJoystick(joystick: JoystickState, x: number, y: number) {
        joystick.current = { x, y };
        
        let dx = x - joystick.origin.x;
        let dy = y - joystick.origin.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.deadzone) {
            joystick.vector = { x: 0, y: 0 };
            return;
        }

        // Radial clamping
        if (distance > this.maxRadius) {
            dx = (dx / distance) * this.maxRadius;
            dy = (dy / distance) * this.maxRadius;
            joystick.current = {
                x: joystick.origin.x + dx,
                y: joystick.origin.y + dy
            };
            distance = this.maxRadius;
        }

        // Normalize vector [-1, 1]
        joystick.vector = {
            x: dx / this.maxRadius,
            y: dy / this.maxRadius
        };
    }
}
