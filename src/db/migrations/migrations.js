import journal from './meta/_journal.json';
import m0000 from './0000_wild_sentinels.sql';
import m0001 from './0001_add_recipe_table_triggers.sql';
import m0002 from './0002_seed_tag_tables.sql';
import m0003 from './0003_db_dump.sql';
import m0004 from './0004_fts_search.sql';

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
  