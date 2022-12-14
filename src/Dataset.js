class Dataset {

    constructor () {
        this._dataset = {};
        this._rownum = {};
    }

    create (table, row) {
        if (this._rownum[table] === undefined) {
            this._dataset[table] = {};
            this._rownum[table] = 1;
        }
        row.id = this._rownum[table]++;
        this._dataset[table][row.id] = row;
        return this._dataset[table][row.id];
    }

    read (table, id) {
        if (this._dataset[table] === undefined) {
            return {};

        } else if (isNaN(id)) {
            return Object.values(this._dataset[table]);

        } else if (this._dataset[table][id] !== undefined) {
            return this._dataset[table][id];
        }
        return {};
    }

    update (table, row) {
        if (this._rownum[table] === undefined) {
            this._dataset[table] = {};
            this._rownum[table] = 1;
        }
        this._dataset[table][row.id] = this._dataset[table][row.id] || {};
        for (let field in row) {
            this._dataset[table][row.id][field] = row[field];
        }
        return this._dataset[table][row.id];
    }

    delete (table, id) {
        if (this._dataset[table] !== undefined) {
            if (isNaN(id)) {
                delete this._dataset[table];
            } else {
                delete this._dataset[table][id];
            }
        }
        return {};
    }

    replace (table, row) {
        if (this._rownum[table] === undefined) {
            this._dataset[table] = {};
            this._rownum[table] = 1;
        }
        this._dataset[table][row.id] = row;
        return this._dataset[table][row.id];
    }
}

module.exports = Dataset;
