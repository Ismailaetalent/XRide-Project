<template>
  <div class="policy-page privacy-page">
    <div class="container">
      <div class="page-header">
        <h1>{{ $t('policy.privacyTitle') }}</h1>
        <p class="last-updated">{{ $t('policy.lastUpdated') }}: January 15, 2024</p>
      </div>

      <div class="policy-content">
        <section class="policy-section">
          <h2>1. {{ $t('policy.introduction') }}</h2>
          <p>{{ $t('policy.privacyIntroText1') }}</p>
          <p>{{ $t('policy.privacyIntroText2') }}</p>
        </section>

        <section class="policy-section">
          <h2>2. {{ $t('policy.informationCollection') }}</h2>
          <p>{{ $t('policy.informationCollectionText') }}</p>

          <h3>2.1 {{ $t('policy.personalData') }}</h3>
          <p>{{ $t('policy.personalDataText') }}</p>
          <ul class="data-list">
            <li>{{ $t('policy.personalDataItem1') }}</li>
            <li>{{ $t('policy.personalDataItem2') }}</li>
            <li>{{ $t('policy.personalDataItem3') }}</li>
            <li>{{ $t('policy.personalDataItem4') }}</li>
            <li>{{ $t('policy.personalDataItem5') }}</li>
          </ul>

          <h3>2.2 {{ $t('policy.technicalData') }}</h3>
          <p>{{ $t('policy.technicalDataText') }}</p>
          <ul class="data-list">
            <li>{{ $t('policy.technicalDataItem1') }}</li>
            <li>{{ $t('policy.technicalDataItem2') }}</li>
            <li>{{ $t('policy.technicalDataItem3') }}</li>
            <li>{{ $t('policy.technicalDataItem4') }}</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>3. {{ $t('policy.usageOfData') }}</h2>
          <p>{{ $t('policy.usageOfDataText') }}</p>
          <ul class="data-list">
            <li>{{ $t('policy.usageItem1') }}</li>
            <li>{{ $t('policy.usageItem2') }}</li>
            <li>{{ $t('policy.usageItem3') }}</li>
            <li>{{ $t('policy.usageItem4') }}</li>
            <li>{{ $t('policy.usageItem5') }}</li>
            <li>{{ $t('policy.usageItem6') }}</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>4. {{ $t('policy.dataStorage') }}</h2>
          <p>{{ $t('policy.dataStorageText1') }}</p>
          <p>{{ $t('policy.dataStorageText2') }}</p>
        </section>

        <section class="policy-section">
          <h2>5. {{ $t('policy.dataSharing') }}</h2>
          <p>{{ $t('policy.dataSharingText1') }}</p>
          <p>{{ $t('policy.dataSharingText2') }}</p>

          <h3>5.1 {{ $t('policy.thirdParties') }}</h3>
          <p>{{ $t('policy.thirdPartiesText') }}</p>
          <ul class="data-list">
            <li>{{ $t('policy.thirdPartiesItem1') }}</li>
            <li>{{ $t('policy.thirdPartiesItem2') }}</li>
            <li>{{ $t('policy.thirdPartiesItem3') }}</li>
            <li>{{ $t('policy.thirdPartiesItem4') }}</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>6. {{ $t('policy.cookies') }}</h2>
          <p>{{ $t('policy.cookiesText1') }}</p>
          <p>{{ $t('policy.cookiesText2') }}</p>

          <h3>6.1 {{ $t('policy.cookieTypes') }}</h3>
          <p>{{ $t('policy.cookieTypesText') }}</p>
          <ul class="data-list">
            <li><strong>{{ $t('policy.essentialCookies') }}</strong> - {{ $t('policy.essentialCookiesDesc') }}</li>
            <li><strong>{{ $t('policy.analyticsCookies') }}</strong> - {{ $t('policy.analyticsCookiesDesc') }}</li>
            <li><strong>{{ $t('policy.functionalCookies') }}</strong> - {{ $t('policy.functionalCookiesDesc') }}</li>
            <li><strong>{{ $t('policy.targetingCookies') }}</strong> - {{ $t('policy.targetingCookiesDesc') }}</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>7. {{ $t('policy.userRights') }}</h2>
          <p>{{ $t('policy.userRightsText') }}</p>
          <ul class="data-list">
            <li><strong>{{ $t('policy.rightToAccess') }}</strong> - {{ $t('policy.rightToAccessDesc') }}</li>
            <li><strong>{{ $t('policy.rightToRectification') }}</strong> - {{ $t('policy.rightToRectificationDesc') }}</li>
            <li><strong>{{ $t('policy.rightToErasure') }}</strong> - {{ $t('policy.rightToErasureDesc') }}</li>
            <li><strong>{{ $t('policy.rightToRestriction') }}</strong> - {{ $t('policy.rightToRestrictionDesc') }}</li>
            <li><strong>{{ $t('policy.rightToDataPortability') }}</strong> - {{ $t('policy.rightToDataPortabilityDesc') }}</li>
            <li><strong>{{ $t('policy.rightToObject') }}</strong> - {{ $t('policy.rightToObjectDesc') }}</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>8. {{ $t('policy.dataSecurity') }}</h2>
          <p>{{ $t('policy.dataSecurityText1') }}</p>
          <p>{{ $t('policy.dataSecurityText2') }}</p>
        </section>

        <section class="policy-section">
          <h2>9. {{ $t('policy.childrenPrivacy') }}</h2>
          <p>{{ $t('policy.childrenPrivacyText') }}</p>
        </section>

        <section class="policy-section">
          <h2>10. {{ $t('policy.changes') }}</h2>
          <p>{{ $t('policy.changesText') }}</p>
        </section>

        <section class="policy-section">
          <h2>11. {{ $t('policy.contactInformation') }}</h2>
          <p>{{ $t('policy.privacyContactText') }}</p>
          <address class="contact-info">
            <p>GetTransfer LTD</p>
            <p>57 Spyrou Kyprianou, Bybloserve Business Center, 2nd Floor, 6051, Larnaca, Cyprus</p>
            <p>Email: privacy@gettransfer.com</p>
          </address>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.policy-page {
  padding: 4rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #333;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-header {
  margin-bottom: 3rem;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #222;
}

.last-updated {
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
}

.policy-section {
  margin-bottom: 2.5rem;
}

.policy-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #f86906;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.policy-section h3 {
  font-size: 1.25rem;
  margin: 1.5rem 0 1rem;
  color: #444;
}

.policy-section p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.data-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.data-list li {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
}

.data-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #f86906;
  font-weight: bold;
}

.contact-info {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  border-left: 3px solid #f86906;
  font-style: normal;
  margin-top: 1rem;
}

.contact-info p {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .policy-page {
    padding: 2rem 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .policy-section h2 {
    font-size: 1.3rem;
  }

  .policy-section h3 {
    font-size: 1.1rem;
  }
}
</style>
