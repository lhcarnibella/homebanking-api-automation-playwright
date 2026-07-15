type User = {
  username: string;
  password: string;
};

export const users: Record<string, User> = {
  validUser: { username: 'demo', password: 'demo123' },
  invalidUser: { username: 'wrong', password: 'wrong' }, 
};


