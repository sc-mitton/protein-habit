import journal from './meta/_journal.json';
import m0000 from './0000_typical_scrambler.sql';
import m0001 from './0001_seed_enums.sql';
import m0002 from './0002_fts_search.sql';
import m0003 from './0003_flimsy_thing.sql';
import m0004 from './0004_db_dump.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004
    }
  }
  