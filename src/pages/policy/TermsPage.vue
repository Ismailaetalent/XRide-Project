<template>
  <div class="policy-page terms-page">
    <div class="container">
      <div class="page-header">
        <h1>{{ $t('policy.termsTitle') }}</h1>
        <p class="last-updated">{{ $t('policy.lastUpdated') }}: January 15, 2024</p>
      </div>

      <div class="policy-content">
        <section class="policy-section">
          <h2>1. {{ $t('policy.introduction') }}</h2>
          <p>{{ $t('policy.introductionText1') }}</p>
          <p>{{ $t('policy.introductionText2') }}</p>
        </section>

        <section class="policy-section">
          <h2>2. {{ $t('policy.defAndInterpretation') }}</h2>
          <p>{{ $t('policy.defIntroText') }}</p>

          <ul class="definition-list">
            <li>
              <strong>"{{ $t('policy.agreement') }}"</strong> - {{ $t('policy.agreementDef') }}
            </li>
            <li>
              <strong>"{{ $t('policy.service') }}"</strong> - {{ $t('policy.serviceDef') }}
            </li>
            <li>
              <strong>"{{ $t('policy.company') }}"</strong> - {{ $t('policy.companyDef') }}
            </li>
            <li>
              <strong>"{{ $t('policy.customer') }}"</strong> - {{ $t('policy.customerDef') }}
            </li>
            <li>
              <strong>"{{ $t('policy.partner') }}"</strong> - {{ $t('policy.partnerDef') }}
            </li>
            <li>
              <strong>"{{ $t('policy.website') }}"</strong> - {{ $t('policy.websiteDef') }}
            </li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>3. {{ $t('policy.acceptanceOfTerms') }}</h2>
          <p>{{ $t('policy.acceptanceText1') }}</p>
          <p>{{ $t('policy.acceptanceText2') }}</p>
        </section>

        <section class="policy-section">
          <h2>4. {{ $t('policy.serviceDescription') }}</h2>
          <p>{{ $t('policy.serviceDescText1') }}</p>
          <p>{{ $t('policy.serviceDescText2') }}</p>
          <p>{{ $t('policy.serviceDescText3') }}</p>
        </section>

        <section class="policy-section">
          <h2>5. {{ $t('policy.userRegistration') }}</h2>
          <p>{{ $t('policy.userRegText1') }}</p>
          <p>{{ $t('policy.userRegText2') }}</p>
          <p>{{ $t('policy.userRegText3') }}</p>
        </section>

        <section class="policy-section">
          <h2>6. {{ $t('policy.bookingAndPayment') }}</h2>
          <p>{{ $t('policy.bookingText1') }}</p>
          <p>{{ $t('policy.bookingText2') }}</p>
          <p>{{ $t('policy.bookingText3') }}</p>

          <h3>6.1 {{ $t('policy.pricing') }}</h3>
          <p>{{ $t('policy.pricingText1') }}</p>
          <p>{{ $t('policy.pricingText2') }}</p>

          <h3>6.2 {{ $t('policy.cancellation') }}</h3>
          <p>{{ $t('policy.cancellationText1') }}</p>
          <p>{{ $t('policy.cancellationText2') }}</p>
        </section>

        <section class="policy-section">
          <h2>7. {{ $t('policy.intellectualProperty') }}</h2>
          <p>{{ $t('policy.intellectualPropertyText1') }}</p>
          <p>{{ $t('policy.intellectualPropertyText2') }}</p>
        </section>

        <section class="policy-section">
          <h2>8. {{ $t('policy.limitationOfLiability') }}</h2>
          <p>{{ $t('policy.liabilityText1') }}</p>
          <p>{{ $t('policy.liabilityText2') }}</p>
        </section>

        <section class="policy-section">
          <h2>9. {{ $t('policy.modificationsToAgreement') }}</h2>
          <p>{{ $t('policy.modificationsText1') }}</p>
          <p>{{ $t('policy.modificationsText2') }}</p>
        </section>

        <section class="policy-section">
          <h2>10. {{ $t('policy.governingLaw') }}</h2>
          <p>{{ $t('policy.governingLawText1') }}</p>
          <p>{{ $t('policy.governingLawText2') }}</p>
        </section>

        <section class="policy-section">
          <h2>11. {{ $t('policy.contactInformation') }}</h2>
          <p>{{ $t('policy.contactText1') }}</p>
          <address class="contact-info">
            <p>GetTransfer LTD</p>
            <p>57 Spyrou Kyprianou, Bybloserve Business Center, 2nd Floor, 6051, Larnaca, Cyprus</p>
            <p>Email: support@gettransfer.com</p>
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

.definition-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.definition-list li {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
}

.definition-list li::before {
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
