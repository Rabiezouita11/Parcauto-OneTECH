package com.ontech.OBS.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;



@RequiredArgsConstructor
public enum Permission {

    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_Activate("ADMIN:Acivate"),
    ADMIN_DELETE("admin:delete"),
    MANAGER_READ("management:read"),
    MANAGER_UPDATE("management:update"),
    MANAGER_CREATE("management:create"),
    MANAGER_DELETE("management:delete"),
    RH_READ("RH:read"),
    CONDUCTEUR_READ("conducteur:read");

    @Getter
    private final String permission;
}