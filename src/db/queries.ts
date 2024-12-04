export async function execSQL(db: D1Database, query: string, params: any[] = []) {
  console.log('Executing SQL:', query, 'with params:', params);
  return db.prepare(query).bind(...params).run();
}

export async function execSQLAll(db: D1Database, query: string, params: any[] = []) {
  console.log('Executing SQL:', query, 'with params:', params);
  return db.prepare(query).bind(...params).all();
}