'use strict';

import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createCustomer, createCustomerTable, getCustomers } from '@tests/foundation/.ancillary/examples/testcontainers/funcs';

describe('Postgres Testcontainers example', () => {
    let postgresContainer: StartedPostgreSqlContainer;
    let postgresClient: Client;

    beforeAll(async () => {
        postgresContainer = await new PostgreSqlContainer('postgres:18-alpine').start();

        postgresClient = new Client({ connectionString: postgresContainer.getConnectionUri() });
        await postgresClient.connect();
        await createCustomerTable(postgresClient);
    }, 60000);

    afterAll(async () => {
        await postgresClient.end();
        await postgresContainer.stop();
    });

    it('creates and returns multiple customers', async () => {
        const customer1 = { id: 1, name: 'John Doe' };
        const customer2 = { id: 2, name: 'Jane Doe' };

        await createCustomer(postgresClient, customer1);
        await createCustomer(postgresClient, customer2);

        const customers = await getCustomers(postgresClient);
        expect(customers).toEqual([customer1, customer2]);
    });
});
