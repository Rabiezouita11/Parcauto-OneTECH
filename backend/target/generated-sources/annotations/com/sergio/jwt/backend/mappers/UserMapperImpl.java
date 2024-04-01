package com.sergio.jwt.backend.mappers;

import com.sergio.jwt.backend.dtos.SignUpDto;
import com.sergio.jwt.backend.dtos.UserDto;
import com.sergio.jwt.backend.entites.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-04-01T16:52:42+0100",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toUserDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto.UserDtoBuilder userDto = UserDto.builder();

        userDto.id( user.getId() );
        userDto.firstName( user.getFirstName() );
        userDto.lastName( user.getLastName() );
        userDto.login( user.getLogin() );

        return userDto.build();
    }

    @Override
    public User signUpToUser(SignUpDto signUpDto) {
        if ( signUpDto == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.firstName( signUpDto.firstName() );
        user.lastName( signUpDto.lastName() );
        user.login( signUpDto.login() );

        return user.build();
    }
}
