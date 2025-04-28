<template>
  <div class="vehicle-page">
    <h1>{{ $t('driver.vehicle') }}</h1>
    <p class="page-subtitle">{{ $t('driver.vehicleDesc') }}</p>

    <div class="vehicle-content">
      <div class="vehicle-info-card">
        <div class="card-header">
          <h2>{{ $t('driver.vehicleInfo') }}</h2>
          <button
            v-if="!editMode"
            class="edit-btn"
            @click="toggleEditMode"
          >
            <i class="fas fa-pencil-alt"></i>
            {{ $t('common.edit') }}
          </button>
          <div class="header-actions" v-else>
            <button class="cancel-btn" @click="cancelEdit">
              {{ $t('common.cancel') }}
            </button>
            <button class="save-btn" @click="saveVehicleInfo">
              {{ $t('common.save') }}
            </button>
          </div>
        </div>

        <div class="vehicle-details" :class="{ 'editable': editMode }">
          <div class="form-group">
            <label for="vehicle-type">{{ $t('driver.vehicleType') }}</label>
            <select
              id="vehicle-type"
              v-model="vehicleData.type"
              :disabled="!editMode"
            >
              <option v-for="type in vehicleTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="vehicle-make">{{ $t('driver.make') }}</label>
            <input
              id="vehicle-make"
              type="text"
              v-model="vehicleData.make"
              :disabled="!editMode"
            >
          </div>

          <div class="form-group">
            <label for="vehicle-model">{{ $t('driver.model') }}</label>
            <input
              id="vehicle-model"
              type="text"
              v-model="vehicleData.model"
              :disabled="!editMode"
            >
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="vehicle-year">{{ $t('driver.year') }}</label>
              <input
                id="vehicle-year"
                type="number"
                v-model.number="vehicleData.year"
                :disabled="!editMode"
                min="1990"
                max="2025"
              >
            </div>

            <div class="form-group">
              <label for="vehicle-color">{{ $t('driver.color') }}</label>
              <input
                id="vehicle-color"
                type="text"
                v-model="vehicleData.color"
                :disabled="!editMode"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="vehicle-plate">{{ $t('driver.licensePlate') }}</label>
              <input
                id="vehicle-plate"
                type="text"
                v-model="vehicleData.licensePlate"
                :disabled="!editMode"
              >
            </div>

            <div class="form-group">
              <label for="vehicle-capacity">{{ $t('driver.capacity') }}</label>
              <input
                id="vehicle-capacity"
                type="number"
                v-model.number="vehicleData.capacity"
                :disabled="!editMode"
                min="1"
                max="50"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="vehicle-features">{{ $t('driver.features') }}</label>
            <div class="features-container" :class="{ 'disabled': !editMode }">
              <div
                v-for="feature in availableFeatures"
                :key="feature.value"
                class="feature-checkbox"
              >
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    :value="feature.value"
                    v-model="vehicleData.features"
                    :disabled="!editMode"
                  >
                  <span class="checkbox-text">{{ feature.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="vehicle-photos-card">
        <div class="card-header">
          <h2>{{ $t('driver.vehiclePhotos') }}</h2>
          <button
            class="add-btn"
            @click="triggerPhotoUpload"
          >
            <i class="fas fa-plus"></i>
            {{ $t('driver.addPhoto') }}
          </button>
          <input
            type="file"
            ref="photoInput"
            style="display: none"
            accept="image/*"
            @change="handlePhotoUpload"
            multiple
          >
        </div>

        <div v-if="vehiclePhotos.length === 0" class="empty-photos">
          <div class="empty-icon">
            <i class="fas fa-car"></i>
          </div>
          <p>{{ $t('driver.noPhotosYet') }}</p>
          <p class="empty-subtitle">{{ $t('driver.photoRequirement') }}</p>
        </div>

        <div v-else class="photos-grid">
          <div
            v-for="(photo, index) in vehiclePhotos"
            :key="index"
            class="photo-item"
          >
            <div class="photo-container">
              <img :src="photo.url" :alt="`Vehicle photo ${index + 1}`">
              <div class="photo-overlay">
                <button class="delete-photo-btn" @click="deletePhoto(index)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <div class="photo-caption">{{ photo.caption }}</div>
          </div>
        </div>
      </div>

      <div class="documents-card">
        <div class="card-header">
          <h2>{{ $t('driver.documents') }}</h2>
          <button
            class="add-btn"
            @click="triggerDocumentUpload"
          >
            <i class="fas fa-plus"></i>
            {{ $t('driver.addDocument') }}
          </button>
          <input
            type="file"
            ref="documentInput"
            style="display: none"
            accept=".pdf,.jpg,.jpeg,.png"
            @change="handleDocumentUpload"
          >
        </div>

        <div class="documents-list">
          <div class="document-item" v-for="(doc, index) in requiredDocuments" :key="doc.id">
            <div class="document-info">
              <div class="document-icon">
                <i :class="getDocumentIcon(doc.type)"></i>
              </div>
              <div class="document-details">
                <div class="document-name">{{ doc.name }}</div>
                <div class="document-status" :class="doc.status">
                  {{ $t(`driver.${doc.status}`) }}
                  <span v-if="doc.expiryDate && doc.status === 'approved'">
                    ({{ $t('driver.validUntil') }}: {{ formatDate(doc.expiryDate) }})
                  </span>
                </div>
              </div>
            </div>
            <div class="document-actions">
              <button
                v-if="doc.status !== 'pending'"
                class="upload-btn"
                @click="triggerSpecificDocumentUpload(doc.id)"
              >
                <i class="fas fa-upload"></i>
                {{ doc.fileUrl ? $t('driver.replace') : $t('driver.upload') }}
              </button>
              <a
                v-if="doc.fileUrl"
                :href="doc.fileUrl"
                target="_blank"
                class="view-btn"
              >
                <i class="fas fa-eye"></i>
                {{ $t('driver.view') }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="verification-status-card">
        <h2>{{ $t('driver.verificationStatus') }}</h2>
        <div class="verification-status">
          <div class="status-icon" :class="verificationStatus">
            <i :class="getVerificationIcon(verificationStatus)"></i>
          </div>
          <div class="status-details">
            <div class="status-heading">{{ $t(`driver.${verificationStatus}Status`) }}</div>
            <div class="status-message">{{ $t(`driver.${verificationStatus}Message`) }}</div>
          </div>
        </div>

        <div class="verification-steps">
          <div
            v-for="step in verificationSteps"
            :key="step.id"
            class="verification-step"
            :class="{ 'completed': step.completed }"
          >
            <div class="step-indicator">
              <i v-if="step.completed" class="fas fa-check"></i>
              <span v-else>{{ step.order }}</span>
            </div>
            <div class="step-details">
              <div class="step-name">{{ step.name }}</div>
              <div class="step-description">{{ step.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Vehicle information state
const editMode = ref(false)
const vehicleData = reactive({
  type: 'comfort',
  make: 'Toyota',
  model: 'Camry',
  year: 2022,
  color: 'Black',
  licensePlate: 'ABC123',
  capacity: 4,
  features: ['airConditioning', 'bluetooth', 'childSeat', 'luggage']
})

// Original data for cancel operation
let originalData = { ...vehicleData }

// Vehicle types
const vehicleTypes = [
  { value: 'economy', label: t('booking.economy') },
  { value: 'comfort', label: t('booking.comfort') },
  { value: 'business', label: t('booking.business') },
  { value: 'premium', label: t('booking.premium') },
  { value: 'vip', label: t('booking.vip') },
  { value: 'suv', label: t('booking.suv') },
  { value: 'van', label: t('booking.van') },
  { value: 'minibus', label: t('booking.minibus') }
]

// Available features
const availableFeatures = [
  { value: 'airConditioning', label: t('driver.airConditioning') },
  { value: 'bluetooth', label: t('driver.bluetooth') },
  { value: 'childSeat', label: t('driver.childSeat') },
  { value: 'wifi', label: t('driver.wifi') },
  { value: 'luggage', label: t('driver.extraLuggage') },
  { value: 'petFriendly', label: t('driver.petFriendly') },
  { value: 'wheelchair', label: t('driver.wheelchair') },
  { value: 'leatherSeats', label: t('driver.leatherSeats') }
]

// Vehicle photos
const photoInput = ref(null)
const vehiclePhotos = ref([
  {
    url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwY2Ftcnl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    caption: 'Front view'
  },
  {
    url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwY2Ftcnl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    caption: 'Side view'
  }
])

// Documents section
const documentInput = ref(null)
const requiredDocuments = ref([
  {
    id: 'vehicleRegistration',
    name: t('driver.vehicleRegistration'),
    type: 'registration',
    status: 'approved',
    expiryDate: '2026-05-15',
    fileUrl: 'https://example.com/registration.pdf'
  },
  {
    id: 'insurance',
    name: t('driver.insurance'),
    type: 'insurance',
    status: 'approved',
    expiryDate: '2025-09-30',
    fileUrl: 'https://example.com/insurance.pdf'
  },
  {
    id: 'inspection',
    name: t('driver.inspection'),
    type: 'inspection',
    status: 'pending',
    expiryDate: null,
    fileUrl: 'https://example.com/inspection.pdf'
  },
  {
    id: 'permitLicense',
    name: t('driver.permitLicense'),
    type: 'permit',
    status: 'missing',
    expiryDate: null,
    fileUrl: null
  }
])

// Verification status
const verificationStatus = ref('pending') // 'approved', 'pending', 'rejected'
const verificationSteps = ref([
  {
    id: 'profileComplete',
    order: 1,
    name: t('driver.profileComplete'),
    description: t('driver.profileCompleteDesc'),
    completed: true
  },
  {
    id: 'documentsSubmitted',
    order: 2,
    name: t('driver.documentsSubmitted'),
    description: t('driver.documentsSubmittedDesc'),
    completed: true
  },
  {
    id: 'backgroundCheck',
    order: 3,
    name: t('driver.backgroundCheck'),
    description: t('driver.backgroundCheckDesc'),
    completed: false
  },
  {
    id: 'approval',
    order: 4,
    name: t('driver.finalApproval'),
    description: t('driver.finalApprovalDesc'),
    completed: false
  }
])

// Methods
function toggleEditMode() {
  editMode.value = true
  // Store original data for cancel operation
  originalData = { ...vehicleData }
}

function cancelEdit() {
  // Restore original data
  Object.assign(vehicleData, originalData)
  editMode.value = false
}

function saveVehicleInfo() {
  // In a real app, this would send data to the API
  editMode.value = false
  console.log('Saved vehicle info:', vehicleData)
  alert(t('driver.vehicleInfoSaved'))
}

function triggerPhotoUpload() {
  photoInput.value.click()
}

function handlePhotoUpload(event) {
  const files = event.target.files
  if (!files.length) return

  // In a real app, this would upload the files to a server
  // For now, we'll create local URLs for preview
  Array.from(files).forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      vehiclePhotos.value.push({
        url: e.target.result,
        caption: `Photo ${vehiclePhotos.value.length + 1}`
      })
    }
    reader.readAsDataURL(file)
  })

  // Reset the input
  event.target.value = ''
}

function deletePhoto(index) {
  // Show confirmation dialog
  if (confirm(t('driver.confirmDeletePhoto'))) {
    vehiclePhotos.value.splice(index, 1)
  }
}

function triggerDocumentUpload() {
  documentInput.value.click()
}

function triggerSpecificDocumentUpload(docId) {
  // In a real app, we'd set the current document ID
  // For now, just open the file dialog
  documentInput.value.click()
}

function handleDocumentUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // In a real app, this would upload the file to a server
  // For this demo, we'll just update the first missing document
  const missingDoc = requiredDocuments.value.find(doc => !doc.fileUrl)
  if (missingDoc) {
    missingDoc.fileUrl = URL.createObjectURL(file)
    missingDoc.status = 'pending'
    alert(t('driver.documentUploaded', { document: missingDoc.name }))
  } else {
    alert(t('driver.selectDocumentToReplace'))
  }

  // Reset the input
  event.target.value = ''
}

function getDocumentIcon(type) {
  switch (type) {
    case 'registration':
      return 'fas fa-id-card'
    case 'insurance':
      return 'fas fa-shield-alt'
    case 'inspection':
      return 'fas fa-clipboard-check'
    case 'permit':
      return 'fas fa-certificate'
    default:
      return 'fas fa-file-alt'
  }
}

function getVerificationIcon(status) {
  switch (status) {
    case 'approved':
      return 'fas fa-check-circle'
    case 'pending':
      return 'fas fa-clock'
    case 'rejected':
      return 'fas fa-times-circle'
    default:
      return 'fas fa-question-circle'
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Initialize component
onMounted(() => {
  // In a real app, this would fetch the vehicle data from the API
})
</script>

<style scoped>
.vehicle-page {
  padding: 1.5rem;
}

h1 {
  font-size: 1.75rem;
  color: #333;
  margin: 0 0 0.5rem;
}

.page-subtitle {
  color: #666;
  margin-bottom: 1.5rem;
}

.vehicle-content {
  display: grid;
  gap: 1.5rem;
}

.vehicle-info-card,
.vehicle-photos-card,
.documents-card,
.verification-status-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.edit-btn,
.add-btn,
.save-btn,
.cancel-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background: none;
  border: none;
  color: #0366d6;
}

.add-btn {
  background-color: #0366d6;
  border: none;
  color: white;
}

.add-btn:hover {
  background-color: #0255b3;
}

.save-btn {
  background-color: #25b847;
  border: none;
  color: white;
}

.save-btn:hover {
  background-color: #1e9e3e;
}

.cancel-btn {
  background-color: white;
  border: 1px solid #e0e0e0;
  color: #666;
}

.cancel-btn:hover {
  background-color: #f5f5f5;
}

.vehicle-details.editable {
  border: 1px solid #c8e1ff;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #f9fcff;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: inherit;
  background-color: white;
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.features-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
  background-color: white;
}

.features-container.disabled {
  background-color: #f5f5f5;
}

.feature-checkbox {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input {
  margin-right: 0.5rem;
  width: auto;
}

.checkbox-text {
  font-size: 0.9rem;
}

.empty-photos {
  text-align: center;
  padding: 3rem 1rem;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  margin-top: 1rem;
}

.empty-icon {
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 1rem;
}

.empty-photos p {
  color: #666;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  font-size: 0.9rem;
  color: #999;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.photo-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.photo-container {
  position: relative;
  height: 150px;
}

.photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-container:hover .photo-overlay {
  opacity: 1;
}

.delete-photo-btn {
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e53935;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-photo-btn:hover {
  background-color: #e53935;
  color: white;
}

.photo-caption {
  padding: 0.75rem;
  font-size: 0.9rem;
  color: #666;
  background-color: #f9f9f9;
  text-align: center;
}

.documents-list {
  display: grid;
  gap: 1rem;
}

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.document-info {
  display: flex;
  align-items: center;
}

.document-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  margin-right: 1rem;
  font-size: 1.25rem;
  color: #666;
}

.document-details {
  flex: 1;
}

.document-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.document-status {
  font-size: 0.85rem;
}

.document-status.approved {
  color: #25b847;
}

.document-status.pending {
  color: #f5a623;
}

.document-status.missing,
.document-status.rejected {
  color: #e53935;
}

.document-actions {
  display: flex;
  gap: 0.75rem;
}

.upload-btn,
.view-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.upload-btn {
  background-color: #0366d6;
  border: none;
  color: white;
}

.upload-btn:hover {
  background-color: #0255b3;
}

.view-btn {
  background-color: white;
  border: 1px solid #e0e0e0;
  color: #666;
}

.view-btn:hover {
  background-color: #f5f5f5;
}

.verification-status-card h2 {
  font-size: 1.25rem;
  color: #333;
  margin: 0 0 1.5rem;
}

.verification-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.status-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.75rem;
}

.status-icon.approved {
  background-color: #e3f7eb;
  color: #25b847;
}

.status-icon.pending {
  background-color: #fff5e6;
  color: #f5a623;
}

.status-icon.rejected {
  background-color: #ffebee;
  color: #e53935;
}

.status-details {
  flex: 1;
}

.status-heading {
  font-weight: 500;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.status-message {
  color: #666;
}

.verification-steps {
  display: grid;
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.verification-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-indicator {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  flex-shrink: 0;
}

.verification-step.completed .step-indicator {
  background-color: #25b847;
  color: white;
}

.step-details {
  flex: 1;
}

.step-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.step-description {
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .document-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .document-actions {
    margin-top: 1rem;
    width: 100%;
  }

  .upload-btn,
  .view-btn {
    flex: 1;
    justify-content: center;
  }

  .photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .verification-status {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
}
</style>
