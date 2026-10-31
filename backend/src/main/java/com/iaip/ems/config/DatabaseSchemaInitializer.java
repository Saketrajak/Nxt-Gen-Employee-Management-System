package com.iaip.ems.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class DatabaseSchemaInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaInitializer.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        log.info("Verifying database schema uniqueness constraints for Aadhaar and PAN...");

        try {
            // 1. Correct any legacy duplicate test records or overlapping seed numbers if present
            jdbcTemplate.update(
                    "UPDATE employee_personal_details SET aadhaar_number = '8901-2345-6701' WHERE employee_id = 20 AND aadhaar_number = '8901-2345-6789'"
            );
            jdbcTemplate.update(
                    "UPDATE employee_personal_details SET aadhaar_number = '4567-8901-2302' WHERE employee_id = 21 AND aadhaar_number = '4567-8901-2345'"
            );
            jdbcTemplate.update(
                    "UPDATE employee_personal_details SET aadhaar_number = '9012-3456-7803' WHERE employee_id = 22 AND aadhaar_number = '9012-3456-7890'"
            );

            // 2. Add Unique constraint on aadhaar_number if not already present
            jdbcTemplate.execute(
                    "DO $$ " +
                    "BEGIN " +
                    "    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_personal_aadhaar') THEN " +
                    "        ALTER TABLE employee_personal_details ADD CONSTRAINT uq_personal_aadhaar UNIQUE (aadhaar_number); " +
                    "    END IF; " +
                    "END $$;"
            );
            log.info("Unique constraint 'uq_personal_aadhaar' verified on employee_personal_details.");

            // 3. Add Unique constraint on pan_number if not already present
            jdbcTemplate.execute(
                    "DO $$ " +
                    "BEGIN " +
                    "    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_personal_pan') THEN " +
                    "        ALTER TABLE employee_personal_details ADD CONSTRAINT uq_personal_pan UNIQUE (pan_number); " +
                    "    END IF; " +
                    "END $$;"
            );
            log.info("Unique constraint 'uq_personal_pan' verified on employee_personal_details.");

        } catch (Exception ex) {
            log.warn("Database schema constraint initialization note: {}", ex.getMessage());
        }
    }
}
