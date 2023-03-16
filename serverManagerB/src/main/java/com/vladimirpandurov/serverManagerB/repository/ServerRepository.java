package com.vladimirpandurov.serverManagerB.repository;

import com.vladimirpandurov.serverManagerB.model.Server;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServerRepository extends JpaRepository<Server, Long> {

    Server findByIpAddress(String ipAddress);

}
