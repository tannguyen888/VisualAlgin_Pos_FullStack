// package com.VisualAlign.VisualAlign.controller;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.mockito.Mockito.times;
// import static org.mockito.Mockito.verify;
// import static org.mockito.Mockito.when;

// import java.util.List;

// import org.hibernate.annotations.processing.Exclude;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// import com.VisualAlign.VisualAlign.modal.User;
// import com.VisualAlign.VisualAlign.repository.UserRepository;
// import com.VisualAlign.VisualAlign.service.UserService;

// @ExtendWith(MockitoExtension.class)
// public class UserControllerTest {
// @Mock
// private UserRepository userRepository;

// @InjectMocks
// private UserService userService;

// private User testUser;

// @BeforeEach
// void setUp() {
// testUser = new User();
// testUser.setId(1L);
// testUser.setEmail("123@gmail.com");
// testUser.setPassword("password");
// testUser.setFullName("Test User");
// }

// // @Test
// void testGetUserProfile() {
// when(UserRepository.findAll()).thenReturn(List.of(testUser));

// List<User> users = userRepository.findAll();
// assertEquals(1, users.size());
// assertEquals("Test User", users.get(0).getFullName());

// verify(userRepository, times(1)).findAll();
// }

// }
