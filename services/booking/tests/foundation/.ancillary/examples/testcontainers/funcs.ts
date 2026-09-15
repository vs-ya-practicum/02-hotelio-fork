'use strict';

import { Client } from 'pg';

type TCustomer = {
    id: number;
    name: string;
};

export async function createCustomerTable(client: Client) {
    const sql = 'CREATE TABLE IF NOT EXISTS customers (id INT NOT NULL, name VARCHAR NOT NULL, PRIMARY KEY (id))';
    await client.query(sql);
}

export async function createCustomer(client: Client, customer: TCustomer) {
    const sql = 'INSERT INTO customers (id, name) VALUES($1, $2)';
    await client.query(sql, [customer.id, customer.name]);
}

export async function getCustomers(client: Client): Promise<TCustomer[]> {
    const sql = 'SELECT * FROM customers ORDER BY id ASC';
    const result = await client.query(sql);
    return result.rows as TCustomer[];
}
