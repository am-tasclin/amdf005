package org.algoritmed.amdf005;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
@ImportResource("classpath:config-app-spring.xml")
public class Amdf005Application {

	public static void main(String[] args) {
		SpringApplication.run(Amdf005Application.class, args);
	}

}
