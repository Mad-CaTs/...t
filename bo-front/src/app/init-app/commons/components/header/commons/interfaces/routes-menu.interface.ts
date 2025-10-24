export interface RoutesMenu {
  name_icon: string;
  name_link: string;
  url?: string;
  children?: RoutesMenu[];
}