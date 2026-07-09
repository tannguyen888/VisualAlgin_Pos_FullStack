package com.VisualAlign.VisualAlign.modal;

import com.VisualAlign.VisualAlign.domain.StoreStatus;
import com.VisualAlign.VisualAlign.modal.StoreContact;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String brand;

    @OneToOne
    @JoinColumn(name = "store_admin_id", nullable = false)
    private User storeAdmin;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String description;

    private String storeType;
    private StoreStatus status;

    @Embedded
    private StoreContact contact = new StoreContact();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = StoreStatus.PENDING; // Mặc định khi tạo mới sẽ là PENDING

    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();

    }

    public Store orElseThrow(Object object) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'orElseThrow'");
    }

}
