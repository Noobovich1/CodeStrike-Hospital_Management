package cswebapp.hospitalz.config;

import cswebapp.hospitalz.model.*;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public class EnumConverters {

    @Converter(autoApply = true)
    public static class GenderConverter implements AttributeConverter<Gender, String> {
        @Override
        public String convertToDatabaseColumn(Gender attribute) {
            return attribute == null ? null : attribute.name();
        }
        @Override
        public Gender convertToEntityAttribute(String dbData) {
            if (dbData == null) return null;
            try { return Gender.valueOf(dbData.toUpperCase()); } catch (Exception e) { return null; }
        }
    }

    @Converter(autoApply = true)
    public static class RoomTypeConverter implements AttributeConverter<RoomType, String> {
        @Override
        public String convertToDatabaseColumn(RoomType attribute) {
            return attribute == null ? null : attribute.name();
        }
        @Override
        public RoomType convertToEntityAttribute(String dbData) {
            if (dbData == null) return null;
            try { return RoomType.valueOf(dbData.toUpperCase()); } catch (Exception e) { return null; }
        }
    }

    @Converter(autoApply = true)
    public static class RoomStatusConverter implements AttributeConverter<RoomStatus, String> {
        @Override
        public String convertToDatabaseColumn(RoomStatus attribute) {
            return attribute == null ? null : attribute.name();
        }
        @Override
        public RoomStatus convertToEntityAttribute(String dbData) {
            if (dbData == null) return null;
            try { return RoomStatus.valueOf(dbData.toUpperCase()); } catch (Exception e) { return null; }
        }
    }

    @Converter(autoApply = true)
    public static class PatientStatusConverter implements AttributeConverter<PatientStatus, String> {
        @Override
        public String convertToDatabaseColumn(PatientStatus attribute) {
            return attribute == null ? null : attribute.name();
        }
        @Override
        public PatientStatus convertToEntityAttribute(String dbData) {
            if (dbData == null) return null;
            try { return PatientStatus.valueOf(dbData.toUpperCase()); } catch (Exception e) { return null; }
        }
    }

    @Converter(autoApply = true)
    public static class StaffRoleConverter implements AttributeConverter<StaffRole, String> {
        @Override
        public String convertToDatabaseColumn(StaffRole attribute) {
            return attribute == null ? null : attribute.name();
        }
        @Override
        public StaffRole convertToEntityAttribute(String dbData) {
            if (dbData == null) return null;
            try { return StaffRole.valueOf(dbData.toUpperCase()); } catch (Exception e) { return null; }
        }
    }

    @Converter(autoApply = true)
    public static class ShiftConverter implements AttributeConverter<Shift, String> {
        @Override
        public String convertToDatabaseColumn(Shift attribute) {
            return attribute == null ? null : attribute.name();
        }
        @Override
        public Shift convertToEntityAttribute(String dbData) {
            if (dbData == null) return null;
            try { return Shift.valueOf(dbData.toUpperCase()); } catch (Exception e) { return null; }
        }
    }

    @Converter(autoApply = true)
    public static class AdmissionStatusConverter implements AttributeConverter<AdmissionStatus, String> {
        @Override
        public String convertToDatabaseColumn(AdmissionStatus attribute) {
            return attribute == null ? null : attribute.name();
        }
        @Override
        public AdmissionStatus convertToEntityAttribute(String dbData) {
            if (dbData == null) return null;
            try { return AdmissionStatus.valueOf(dbData.toUpperCase()); } catch (Exception e) { return null; }
        }
    }

    @Converter(autoApply = true)
    public static class PaymentStatusConverter implements AttributeConverter<PaymentStatus, String> {
        @Override
        public String convertToDatabaseColumn(PaymentStatus attribute) {
            return attribute == null ? null : attribute.name();
        }
        @Override
        public PaymentStatus convertToEntityAttribute(String dbData) {
            if (dbData == null) return null;
            try { return PaymentStatus.valueOf(dbData.toUpperCase()); } catch (Exception e) { return null; }
        }
    }
}
