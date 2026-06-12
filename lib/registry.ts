import {
  Building,
  Package,
  IndianRupee,
  Users,
  ClipboardList,
  Factory,
  UserCog,
  User,
  Home,
} from "lucide-react";
import { type EntityRecord } from "@/types";
import { ProjectName } from "@/lib/projects";
import { ProjectSlug } from "@/lib/fields";

import { centers } from "@/data/centers";
import { commodities } from "@/data/commodities";
import { commodityPrices } from "@/data/commodity-prices";
import { customers } from "@/data/customers";
import { weighments } from "@/data/weighments";
import { factories } from "@/data/factories";
import { operators } from "@/data/operators";
import { users } from "@/data/users";
import { villages } from "@/data/villages";

export interface ProjectConfig {
  name: ProjectName;
  icon: React.ComponentType<{ className?: string }>;
  data: EntityRecord[];
}

export const PROJECT_REGISTRY: Record<string, ProjectConfig> = {
  [ProjectSlug.CENTERS]: { name: ProjectName.CENTERS, icon: Building, data: centers },
  [ProjectSlug.COMMODITIES]: { name: ProjectName.COMMODITIES, icon: Package, data: commodities },
  [ProjectSlug.COMMODITY_PRICES]: { name: ProjectName.COMMODITY_PRICES, icon: IndianRupee, data: commodityPrices },
  [ProjectSlug.CUSTOMERS]: { name: ProjectName.CUSTOMERS, icon: Users, data: customers },
  [ProjectSlug.WEIGHMENTS]: { name: ProjectName.WEIGHMENTS, icon: ClipboardList, data: weighments },
  [ProjectSlug.FACTORIES]: { name: ProjectName.FACTORIES, icon: Factory, data: factories },
  [ProjectSlug.OPERATORS]: { name: ProjectName.OPERATORS, icon: UserCog, data: operators },
  [ProjectSlug.USERS]: { name: ProjectName.USERS, icon: User, data: users },
  [ProjectSlug.VILLAGES]: { name: ProjectName.VILLAGES, icon: Home, data: villages },
};
