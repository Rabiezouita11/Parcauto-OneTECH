package com.helloIftekhar.springJwt.initializer;
import com.helloIftekhar.springJwt.service.AdminCreationService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer implements ApplicationRunner {

    private final AdminCreationService adminCreationService;

    public AdminUserInitializer(AdminCreationService adminCreationService) {
        this.adminCreationService = adminCreationService;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // Create the admin user when the application starts
        adminCreationService.createAdminUser();
    }
}