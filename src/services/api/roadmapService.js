import { getApperClient } from "@/services/apperClient";
import React from "react";
import Error from "@/components/ui/Error";

export const roadmapService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('roadmap_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "timeline_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "estimated_date_c"}},
          {"field": {"Name": "linked_feedback_ids_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(item => ({
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        status: item.status_c || 'Planned',
        timeline: item.timeline_c || '',
        votes: item.votes_c || 0,
        estimatedDate: item.estimated_date_c || '',
        linkedFeedbackIds: item.linked_feedback_ids_c ? item.linked_feedback_ids_c.split(',').filter(Boolean).map(id => parseInt(id)) : []
      }));
    } catch (error) {
      console.error("Error fetching roadmap:", error?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('roadmap_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "timeline_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "estimated_date_c"}},
          {"field": {"Name": "linked_feedback_ids_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Roadmap item not found');
      }

      const item = response.data;
      return {
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        status: item.status_c || 'Planned',
        timeline: item.timeline_c || '',
        votes: item.votes_c || 0,
        estimatedDate: item.estimated_date_c || '',
        linkedFeedbackIds: item.linked_feedback_ids_c ? item.linked_feedback_ids_c.split(',').filter(Boolean).map(id => parseInt(id)) : []
      };
    } catch (error) {
      console.error(`Error fetching roadmap ${id}:`, error?.message || error);
      throw error;
    }
  },

  async create(itemData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('roadmap_c', {
        records: [
          {
            Name: itemData.title || 'Untitled',
            title_c: itemData.title,
            description_c: itemData.description,
            status_c: itemData.status || 'Planned',
            timeline_c: itemData.timeline || '',
            votes_c: 0,
            estimated_date_c: itemData.estimatedDate || '',
            linked_feedback_ids_c: Array.isArray(itemData.linkedFeedbackIds) ? itemData.linkedFeedbackIds.join(',') : ''
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
          console.error(`Failed to create roadmap: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || 'Failed to create roadmap item');
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            title: item.title_c || '',
            description: item.description_c || '',
            status: item.status_c || 'Planned',
            timeline: item.timeline_c || '',
            votes: item.votes_c || 0,
            estimatedDate: item.estimated_date_c || '',
            linkedFeedbackIds: item.linked_feedback_ids_c ? item.linked_feedback_ids_c.split(',').filter(Boolean).map(id => parseInt(id)) : []
          };
        }
      }
    } catch (error) {
      console.error("Error creating roadmap:", error?.message || error);
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
      if (updateData.status !== undefined) payload.status_c = updateData.status;
      if (updateData.timeline !== undefined) payload.timeline_c = updateData.timeline;
      if (updateData.votes !== undefined) payload.votes_c = updateData.votes;
      if (updateData.estimatedDate !== undefined) payload.estimated_date_c = updateData.estimatedDate;
      if (updateData.linkedFeedbackIds !== undefined) payload.linked_feedback_ids_c = Array.isArray(updateData.linkedFeedbackIds) ? updateData.linkedFeedbackIds.join(',') : updateData.linkedFeedbackIds;
      
      const response = await apperClient.updateRecord('roadmap_c', {
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
          console.error(`Failed to update roadmap: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || 'Failed to update roadmap item');
        }
        
        if (successful.length > 0) {
          return await this.getById(id);
        }
      }
    } catch (error) {
      console.error("Error updating roadmap:", error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('roadmap_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete roadmap: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || 'Failed to delete roadmap item');
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting roadmap:", error?.message || error);
      throw error;
    }
  },

  async getByTimeline(timeline) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('roadmap_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "timeline_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "estimated_date_c"}},
          {"field": {"Name": "linked_feedback_ids_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [
          {
            "FieldName": "timeline_c",
            "Operator": "EqualTo",
            "Values": [timeline]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(item => ({
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        status: item.status_c || 'Planned',
        timeline: item.timeline_c || '',
        votes: item.votes_c || 0,
        estimatedDate: item.estimated_date_c || '',
        linkedFeedbackIds: item.linked_feedback_ids_c ? item.linked_feedback_ids_c.split(',').filter(Boolean).map(id => parseInt(id)) : []
      }));
    } catch (error) {
      console.error("Error fetching roadmap by timeline:", error?.message || error);
return [];
    }
  }
};