import { getApperClient } from "@/services/apperClient";

export const changelogService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('changelog_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "version_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "release_date_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "release_date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(item => ({
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        version: item.version_c || '',
        type: item.type_c || 'feature',
        releaseDate: item.release_date_c || item.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching changelog:", error?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('changelog_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "version_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "release_date_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Changelog entry not found');
      }

      const item = response.data;
      return {
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        version: item.version_c || '',
        type: item.type_c || 'feature',
        releaseDate: item.release_date_c || item.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching changelog ${id}:`, error?.message || error);
      throw error;
    }
  },

  async create(entryData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('changelog_c', {
        records: [
          {
            Name: entryData.version || 'Untitled',
            title_c: entryData.title,
            description_c: entryData.description,
            version_c: entryData.version,
            type_c: entryData.type,
            release_date_c: entryData.releaseDate ? new Date(entryData.releaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create changelog: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || 'Failed to create changelog entry');
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            title: item.title_c || '',
            description: item.description_c || '',
            version: item.version_c || '',
            type: item.type_c || 'feature',
            releaseDate: item.release_date_c || item.CreatedOn
          };
        }
      }
    } catch (error) {
      console.error("Error creating changelog:", error?.message || error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        Id: parseInt(id)
      };
      
      if (updateData.title !== undefined) payload.title_c = updateData.title;
      if (updateData.description !== undefined) payload.description_c = updateData.description;
      if (updateData.version !== undefined) payload.version_c = updateData.version;
      if (updateData.type !== undefined) payload.type_c = updateData.type;
      if (updateData.releaseDate !== undefined) payload.release_date_c = new Date(updateData.releaseDate).toISOString().split('T')[0];
      
      const response = await apperClient.updateRecord('changelog_c', {
        records: [payload]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update changelog: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || 'Failed to update changelog entry');
        }
        
        if (successful.length > 0) {
          return await this.getById(id);
        }
      }
    } catch (error) {
      console.error("Error updating changelog:", error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('changelog_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete changelog: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || 'Failed to delete changelog entry');
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting changelog:", error?.message || error);
      throw error;
    }
  },

  async getByVersion(version) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('changelog_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "version_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "release_date_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [
          {
            "FieldName": "version_c",
            "Operator": "EqualTo",
            "Values": [version]
          }
        ],
        orderBy: [{"fieldName": "release_date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(item => ({
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        version: item.version_c || '',
        type: item.type_c || 'feature',
        releaseDate: item.release_date_c || item.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching changelog by version:", error?.message || error);
      return [];
    }
  }
};