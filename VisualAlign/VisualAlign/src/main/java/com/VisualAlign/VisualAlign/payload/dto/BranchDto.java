package com.VisualAlign.VisualAlign.payload.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchDto {

    private Long id;

    private String name;

    private String address;

    private String phone;

    private String email;

    private List<String> workingDays;

    private LocalDate openTime;

    private LocalDate closeTime;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

    private StoreDto store;

    private Long storeId;

    private UserDto manager;

}
