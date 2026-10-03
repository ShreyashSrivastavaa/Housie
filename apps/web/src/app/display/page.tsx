import { Metadata } from 'next';
import { ProjectorView } from '../../components/display/ProjectorView';

export const metadata: Metadata = {
  title: 'Projector / TV Display | Housie Live',
  description: 'Distraction-free TV & Projector display screen for live Housie / Tambola games.',
};

export default function DisplayPage() {
  return <ProjectorView />;
}
