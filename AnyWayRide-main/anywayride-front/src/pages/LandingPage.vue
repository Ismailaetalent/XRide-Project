  <template>
    <div>
      <welcome-section />
      <passager-section />
      <chauffeur-section />
    </div>
  </template>

  <script>
  import WelcomeSection from '../components/WelcomeSection.vue';
  import PassagerSection from '../components/PassagerSection.vue';
  import ChauffeurSection from '../components/ChauffeurSection.vue';

  export default {
    name: 'HomePage',
    components: {
      WelcomeSection,
      PassagerSection,
      ChauffeurSection,
    },
  };
  </script>