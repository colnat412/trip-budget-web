export type TripMemberRole = 'OWNER' | 'EDITOR' | 'MEMBER' | 'VIEWER';

export type TripMemberStatus = 'INVITED' | 'ACTIVE' | 'LEFT' | 'REMOVED';

export interface TripMember {
  id: number;
  tripId: number;
  userId: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: TripMemberRole;
  status: TripMemberStatus;
  joinedAt: string;
  createdAt: string;
}

export interface InviteMemberPayload {
  email: string;
  role: TripMemberRole;
}

export interface UpdateRolePayload {
  role: TripMemberRole;
}
