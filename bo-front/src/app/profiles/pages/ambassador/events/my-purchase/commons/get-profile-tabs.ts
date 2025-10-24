import { ITabs } from "src/app/profiles/commons/interface";

/* import { ITabs } from "src/app/profiles/commons/interface";

export function getProfileTabs(setTab: (id: number) => void): ITabs[] {
  return [
    {
      label: 'Compras',
      isActive: true,
      tabAction: () => setTab(1)
    },
    {
      label: 'Rechazados',
      isActive: false,
      tabAction: () => setTab(2)
    },
    {
      label: 'Nominar',
      isActive: false,
      tabAction: () => setTab(3)
    }
  ];
}
 */
export function getProfileTabs(setTab: (id: number) => void, activeTab: number): ITabs[] {
  return [
    {
      label: 'Compras',
      isActive: activeTab === 1,
      tabAction: () => setTab(1)
    },
    {
      label: 'Rechazados',
      isActive: activeTab === 2,
      tabAction: () => setTab(2)
    },
    {
      label: 'Nominar',
      isActive: activeTab === 3,
      tabAction: () => setTab(3)
    }
  ];
}
