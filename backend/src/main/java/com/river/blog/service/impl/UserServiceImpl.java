package com.river.blog.service.impl;

import com.river.blog.dto.LoginRequest;
import com.river.blog.dto.LoginResponse;
import com.river.blog.entity.User;
import com.river.blog.mapper.UserMapper;
import com.river.blog.service.UserService;
import com.river.blog.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 用户Service实现
 * 
 * @author River
 */
@Service
public class UserServiceImpl implements UserService {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public UserServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    
    @Override
    public LoginResponse login(LoginRequest request) {
        // 查询用户
        User user = userMapper.selectByUsername(request.getUsername());
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        
        // 生成Token
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        
        // 构建返回结果
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        
        LoginResponse.UserDTO userDTO = new LoginResponse.UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setNickname(user.getNickname());
        userDTO.setAvatar(user.getAvatar());
        userDTO.setRole(user.getRole());
        userDTO.setProvider(user.getProvider());
        
        response.setUser(userDTO);
        return response;
    }
    
    @Override
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }
    
    @Override
    public User getUserByUsername(String username) {
        return userMapper.selectByUsername(username);
    }
    
    @Override
    public User createUser(User user) {
        // 加密密码
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userMapper.insert(user);
        return user;
    }
    
    @Override
    public User updateUser(User user) {
        userMapper.update(user);
        return userMapper.selectById(user.getId());
    }
}
