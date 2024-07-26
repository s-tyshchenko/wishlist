import {Database} from '../types';
import {createKysely} from '@vercel/postgres-kysely';

const db = createKysely<Database>();

export default db;
