export interface Player {
  id: string;
  name: string;
  number: number;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  isActive: boolean;
  createdAt: Date;
}

export const TEAM_OPTION = {
  id: 'team',
  name: 'チームを応援',
  number: 0,
  position: 'TEAM' as const,
  isActive: true,
};
