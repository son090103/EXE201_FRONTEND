export interface Sport {
    id: number;
    name: string;
}

export interface Location {
    id: number;
    name: string;
}

export interface Community {
    id: number;
    sport_id: number;
    location_id: number;
    Sport?: Sport;        // optional để tránh crash
    Location?: Location;
}

export interface CommunityMember {
    user_id: number;
    community_id: number;
    Community?: Community;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    role_id: number;
    Community_Members?: CommunityMember[];
}
