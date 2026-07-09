import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="glass rounded-xl p-6 transition-all duration-300 hover:shadow-card-glow hover:border-brand-electricBlue/40 cursor-pointer group"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-defenderBlue/10 border border-brand-defenderBlue/20 mb-4 group-hover:bg-brand-defenderBlue/20 transition-colors">
        <Icon size={24} className="text-brand-electricBlue group-hover:text-white transition-colors" />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
