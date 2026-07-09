package com.VisualAlign.VisualAlign.service;

import java.util.List;

import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.modal.User;

public interface UserService {
  User getUserFromJwttoken(String token) throws UserException;

  User getCurrentUser() throws UserException;

  User getUserByEmail(String email) throws UserException;

  User getUserById(Long id) throws UserException;

  List<User> getAllUsers();

  User processOAuthPostLogin(String email, String name);

}
