import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const SettingsPage = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    document.dir = lang === 'he' ? 'rtl' : 'ltr';
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold"
        >
          {t('settings.title')}
        </motion.h1>

        <Card>
          <h2 className="text-xl font-semibold mb-4">{t('settings.language')}</h2>
          <div className="flex gap-3">
            <Button
              variant={i18n.language === 'en' ? 'primary' : 'secondary'}
              onClick={() => handleLanguageChange('en')}
            >
              English
            </Button>
            <Button
              variant={i18n.language === 'he' ? 'primary' : 'secondary'}
              onClick={() => handleLanguageChange('he')}
            >
              עברית
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">{t('settings.refreshInterval')}</h2>
          <p className="text-gray-400 mb-4">
            Configure how often the data is refreshed automatically
          </p>
          <select className="w-full max-w-xs bg-[#1e2538] border border-[#2a3447] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="3000">3 seconds</option>
            <option value="5000">5 seconds</option>
            <option value="10000">10 seconds</option>
            <option value="30000">30 seconds</option>
          </select>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">{t('settings.notifications')}</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded bg-[#1e2538] border-[#2a3447] text-blue-600 focus:ring-2 focus:ring-blue-500"
                defaultChecked
              />
              <span className="text-gray-300">Bot status changes</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded bg-[#1e2538] border-[#2a3447] text-blue-600 focus:ring-2 focus:ring-blue-500"
                defaultChecked
              />
              <span className="text-gray-300">Trade executions</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded bg-[#1e2538] border-[#2a3447] text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-300">Daily reports</span>
            </label>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary">{t('settings.save')}</Button>
        </div>
      </div>
    </Layout>
  );
};
