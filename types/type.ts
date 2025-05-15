export type RefNode = {
  id: number;
  title: string;
  content: string;
  status: string;
  requested: string;
  tally_ayes: string;
  tally_nays: string;
};

export type UserNode = {
  wallet_address: string;
  display_name: string;
  social_links: string[];
  bio: string;
  title: string;
};

// Type for the voters data
export type VotedRelationship = {
  refId: number;
  voterAddress: string;
  voterName: string;
  decision: string;
  votingPower: number;
};