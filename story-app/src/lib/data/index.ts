import productsRaw from './products.json';
import timelineRaw from './timeline.json';
import frameworkRaw from './framework.json';
import personasRaw from './personas.json';
import wizardRaw from './wizard.json';
import adminPathsRaw from './admin-paths.json';
import raciRaw from './raci.json';
import riskRaw from './risk.json';
import individualPathsRaw from './individual-paths.json';

export type Product = {
  id: string;
  name: string;
  description: string;
};

export type ProductGroup = {
  id: string;
  name: string;
  products: Product[];
};

export type ProductCatalog = {
  groups: ProductGroup[];
};

export type TimelineMonth = {
  month: number;
  label: string;
  addedProductIds: string[];
};

export type Timeline = {
  partnerName: string;
  months: TimelineMonth[];
};

export type JourneyItemType =
  | 'course'
  | 'workshop'
  | 'blueprint'
  | 'exam'
  | 'engagement'
  | 'experience';

export type JourneyItem = {
  id: string;
  name: string;
  type: JourneyItemType;
};

export type PersonaBranch = {
  id: string;
  name: string;
  description: string;
  items: JourneyItem[];
};

export type Persona = {
  id: string;
  name: string;
  icon: string;
  description: string;
  branches: PersonaBranch[];
};

export function findPersona(id: string | null) {
  if (!id) return undefined;
  return (personasRaw.personas as Persona[]).find((p) => p.id === id);
}

export type FrameworkOutcome = {
  id: string;
  icon: string;
  title: string;
  sub: string;
  champion?: boolean;
  appearsAtMonth: number;
};

export type FrameworkJourney = {
  id: string;
  product: string;
  persona: string;
  accent: string;
  stages: string[];
  appearsAtMonth: number;
};

export type FrameworkAssetItem = {
  name: string;
  appearsAtMonth: number;
};

export type FrameworkAssetCategory = {
  id: string;
  name: string;
  accent: string;
  items: FrameworkAssetItem[];
};

export type Framework = {
  outcomes: FrameworkOutcome[];
  journeys: FrameworkJourney[];
  assets: FrameworkAssetCategory[];
};

export type WizardOption = {
  id: string;
  label: string;
  icon?: string;
};

export type WizardQuestion = {
  id: string;
  prompt: string;
  options: WizardOption[];
};

export type WizardPersona = {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  questions: WizardQuestion[];
  journeyIntro: string;
  journeyItems: string[];
};

export const products: ProductCatalog = productsRaw;
export const timeline: Timeline = timelineRaw;
export const personas: Persona[] = personasRaw.personas;
export const framework: Framework = frameworkRaw as Framework;
export type GateRequirement = {
  metric: string;
  comparison: string;
};

export type StageGate = {
  label: string;
  requirements: GateRequirement[];
};

export type PathStage = {
  id: string;
  number: number;
  name: string;
  color: string;
  tasks: string[];
  gateTo: StageGate | null;
};

export type AdminPath = {
  id: string;
  name: string;
  description: string;
  stages: PathStage[];
};

export const wizardPersonas: WizardPersona[] = wizardRaw.personas as WizardPersona[];
export const adminPaths: AdminPath[] = adminPathsRaw.paths as AdminPath[];

export type IndividualPath = {
  id: string;
  name: string;
  icon: string;
  description: string;
  stages: PathStage[];
};

export const individualPaths: IndividualPath[] = individualPathsRaw.paths as IndividualPath[];

export type RaciActivity = {
  name: string;
  assignments: string[];
};

export type RaciMatrix = {
  title: string;
  subtitle: string;
  roles: string[];
  activities: RaciActivity[];
};

export const raci: RaciMatrix = raciRaw;

export type RiskGap = {
  name: string;
  available: number;
  needed: number;
  coveragePct: number;
  severity: string;
  detail: string;
};

export type RiskFlag = {
  title: string;
  body: string;
};

export type RiskData = {
  title: string;
  subtitle: string;
  academy: { totalCourses: number; breakdown: { name: string; count: number }[] };
  required: { slots: number; formula: string; currentCoverage: string };
  gaps: RiskGap[];
  flags: RiskFlag[];
};

export const risk: RiskData = riskRaw;

const productIndex = new Map<string, { product: Product; group: ProductGroup }>();
for (const group of products.groups) {
  for (const product of group.products) {
    productIndex.set(product.id, { product, group });
  }
}

export function findProduct(id: string) {
  return productIndex.get(id);
}
