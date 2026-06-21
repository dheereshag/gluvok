import {
  Building,
  IndianRupee,
  Users,
  ClipboardList,
  Factory,
  UserCog,
  User,
  Home,
  Tag,
  UserCheck,
} from "lucide-react";
import { type EntityRecord } from "@/types";
import { ProjectName } from "@/lib/constants/enums";
import { ProjectSlug } from "@/lib/constants/enums";

import { centers } from "@/data/centers";
import { commodities } from "@/data/commodities";
import { rates } from "@/data/rates";
import { customers } from "@/data/customers";
import { weighments } from "@/data/weighments";
import { factories } from "@/data/factories";
import { profiles } from "@/data/profiles";
import { users } from "@/data/users";
import { villages } from "@/data/villages";
import { assignments } from "@/data/assignments";

export interface ProjectConfig {
  name: ProjectName;
  icon: React.ComponentType<{ className?: string }>;
  data: EntityRecord[];
}

export const PROJECT_REGISTRY: Record<string, ProjectConfig> = {
  [ProjectSlug.CENTERS]: { name: ProjectName.CENTERS, icon: Building, data: centers },
  [ProjectSlug.COMMODITIES]: { name: ProjectName.COMMODITIES, icon: Tag, data: commodities },
  [ProjectSlug.RATES]: { name: ProjectName.RATES, icon: IndianRupee, data: rates },
  [ProjectSlug.CUSTOMERS]: { name: ProjectName.CUSTOMERS, icon: Users, data: customers },
  [ProjectSlug.WEIGHMENTS]: { name: ProjectName.WEIGHMENTS, icon: ClipboardList, data: weighments },
  [ProjectSlug.FACTORIES]: { name: ProjectName.FACTORIES, icon: Factory, data: factories },
  [ProjectSlug.PROFILES]: { name: ProjectName.PROFILES, icon: UserCog, data: profiles },
  [ProjectSlug.USERS]: { name: ProjectName.USERS, icon: User, data: users },
  [ProjectSlug.VILLAGES]: { name: ProjectName.VILLAGES, icon: Home, data: villages },
  [ProjectSlug.ASSIGNMENTS]: { name: ProjectName.ASSIGNMENTS, icon: UserCheck, data: assignments },
};
