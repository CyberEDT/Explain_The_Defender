import { motion } from 'framer-motion';
import { Shield, Zap, Target, Crosshair, Map, Activity, BookOpen, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardPreview from '../components/DashboardPreview';
import FeatureCard from '../components/FeatureCard';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { icon: Shield, title: 'Detection Intelligence', description: 'Maps attacker actions to detection opportunities using multi-plane telemetry analysis.' },
    { icon: Crosshair, title: 'IOC Generator', description: 'Produces highly contextual Indicators of Compromise from raw security event streams.' },
    { icon: AlertTriangle, title: 'Alert Simulator', description: 'Visualizes exact SIEM and EDR alerts that trigger at each stage of the attack chain.' },
    { icon: Target, title: 'Threat Investigation', description: 'Interactive visual investigation timeline showing evidence collection workflows.' },
    { icon: Zap, title: 'Incident Response Engine', description: 'Builds dynamic response playbooks aligned to the severity and nature of the threat.' },
    { icon: Map, title: 'MITRE Detection Mapping', description: 'Correlates native detections directly back to MITRE ATT&CK techniques and sub-techniques.' },
    { icon: Activity, title: 'SOC Timeline', description: 'Reconstructs incident progression from initial access to objective completion.' },
    { icon: ShieldAlert, title: 'Defensive Recommendations', description: 'Provides real-time, context-aware remediation guidance to contain and eradicate threats.' },
  ];

  const stages = [
    { id: 'DETECT', desc: 'How is the attack discovered?' },
    { id: 'ALERT', desc: 'What alerts are generated?' },
    { id: 'INVESTIGATE', desc: 'What evidence exists?' },
    { id: 'CONTAIN', desc: 'How can damage be limited?' },
    { id: 'ERADICATE', desc: 'How is the threat removed?' },
    { id: 'RECOVER', desc: 'How are operations restored?' },
    { id: 'IMPROVE', desc: 'How can defenses be strengthened?' },
  ];

  return (
    <div className="space-y-16 max-w-screen-2xl pb-16">
      

      {/* Dashboard Preview Section */}
      <section className="relative z-10 w-full px-4 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <DashboardPreview />
        </motion.div>
      </section>

      {/* Visual Framework Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">The Defense Chain Framework</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Our methodology maps every action in the security lifecycle.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 px-4">
          {stages.map((stage, idx) => (
            <motion.div 
              key={stage.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-6 rounded-xl flex-1 min-w-[200px] border-t-2 border-t-brand-defenderBlue hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="text-brand-electricBlue font-mono text-sm mb-2">{String(idx + 1).padStart(2, '0')} //</div>
              <h3 className="text-xl font-bold text-white mb-2">{stage.id}</h3>
              <p className="text-sm text-text-secondary">{stage.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Enterprise Capabilities</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Built to simulate a true Blue Team Operations Center.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-12">
          {features.map((feature, idx) => (
            <FeatureCard 
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
