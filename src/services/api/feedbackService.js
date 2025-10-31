import { getApperClient } from "@/services/apperClient";

export const feedbackService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('feedback_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "upvotes_c"}},
          {"field": {"Name": "downvotes_c"}},
          {"field": {"Name": "upvoted_by_c"}},
          {"field": {"Name": "downvoted_by_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return (response.data || []).map(item => ({
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        category: item.category_c || 'feature',
        status: item.status_c || 'new',
        upvotes: item.upvotes_c || 0,
        downvotes: item.downvotes_c || 0,
        upvotedBy: item.upvoted_by_c ? item.upvoted_by_c.split(',').filter(Boolean) : [],
        downvotedBy: item.downvoted_by_c ? item.downvoted_by_c.split(',').filter(Boolean) : [],
        votes: item.votes_c || 0,
        createdAt: item.CreatedOn,
        updatedAt: item.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching feedback:", error?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('feedback_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "upvotes_c"}},
          {"field": {"Name": "downvotes_c"}},
          {"field": {"Name": "upvoted_by_c"}},
          {"field": {"Name": "downvoted_by_c"}},
          {"field": {"Name": "votes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Feedback not found');
      }

      const item = response.data;
      return {
        Id: item.Id,
        title: item.title_c || '',
        description: item.description_c || '',
        category: item.category_c || 'feature',
        status: item.status_c || 'new',
        upvotes: item.upvotes_c || 0,
        downvotes: item.downvotes_c || 0,
        upvotedBy: item.upvoted_by_c ? item.upvoted_by_c.split(',').filter(Boolean) : [],
        downvotedBy: item.downvoted_by_c ? item.downvoted_by_c.split(',').filter(Boolean) : [],
        votes: item.votes_c || 0,
        createdAt: item.CreatedOn,
        updatedAt: item.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching feedback ${id}:`, error?.message || error);
      throw error;
    }
  },

  async create(feedbackData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('feedback_c', {
        records: [
          {
            Name: feedbackData.title || 'Untitled',
            title_c: feedbackData.title,
            description_c: feedbackData.description,
            category_c: feedbackData.category,
            status_c: 'new',
            upvotes_c: 0,
            downvotes_c: 0,
            upvoted_by_c: '',
            downvoted_by_c: '',
            votes_c: 0
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
          console.error(`Failed to create feedback: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || 'Failed to create feedback');
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            title: item.title_c || '',
            description: item.description_c || '',
            category: item.category_c || 'feature',
            status: item.status_c || 'new',
            upvotes: item.upvotes_c || 0,
            downvotes: item.downvotes_c || 0,
            upvotedBy: [],
            downvotedBy: [],
            votes: item.votes_c || 0,
            createdAt: item.CreatedOn,
            updatedAt: item.ModifiedOn
          };
        }
      }
    } catch (error) {
      console.error("Error creating feedback:", error?.message || error);
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
      if (updateData.category !== undefined) payload.category_c = updateData.category;
      if (updateData.status !== undefined) payload.status_c = updateData.status;
      if (updateData.upvotes !== undefined) payload.upvotes_c = updateData.upvotes;
      if (updateData.downvotes !== undefined) payload.downvotes_c = updateData.downvotes;
      if (updateData.upvotedBy !== undefined) payload.upvoted_by_c = Array.isArray(updateData.upvotedBy) ? updateData.upvotedBy.join(',') : updateData.upvotedBy;
      if (updateData.downvotedBy !== undefined) payload.downvoted_by_c = Array.isArray(updateData.downvotedBy) ? updateData.downvotedBy.join(',') : updateData.downvotedBy;
      if (updateData.votes !== undefined) payload.votes_c = updateData.votes;
      
      const response = await apperClient.updateRecord('feedback_c', {
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
          console.error(`Failed to update feedback: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || 'Failed to update feedback');
        }
        
        if (successful.length > 0) {
          return await this.getById(id);
        }
      }
    } catch (error) {
      console.error("Error updating feedback:", error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('feedback_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete feedback: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || 'Failed to delete feedback');
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting feedback:", error?.message || error);
      throw error;
    }
  },

  async upvote(id, userId) {
    try {
      const feedback = await this.getById(id);
      
      const hasUpvoted = feedback.upvotedBy.includes(userId);
      const hasDownvoted = feedback.downvotedBy.includes(userId);
      
      let newUpvotedBy = [...feedback.upvotedBy];
      let newDownvotedBy = [...feedback.downvotedBy];
      let newUpvotes = feedback.upvotes;
      let newDownvotes = feedback.downvotes;
      
      if (hasUpvoted) {
        newUpvotes -= 1;
        newUpvotedBy = newUpvotedBy.filter(uid => uid !== userId);
      } else {
        newUpvotes += 1;
        newUpvotedBy.push(userId);
        
        if (hasDownvoted) {
          newDownvotes -= 1;
          newDownvotedBy = newDownvotedBy.filter(uid => uid !== userId);
        }
      }
      
      const netVotes = newUpvotes - newDownvotes;
      
      await this.update(id, {
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        upvotedBy: newUpvotedBy,
        downvotedBy: newDownvotedBy,
        votes: netVotes
      });
      
      return await this.getById(id);
    } catch (error) {
      console.error("Error upvoting feedback:", error?.message || error);
      throw error;
    }
  },

  async downvote(id, userId) {
    try {
      const feedback = await this.getById(id);
      
      const hasDownvoted = feedback.downvotedBy.includes(userId);
      const hasUpvoted = feedback.upvotedBy.includes(userId);
      
      let newUpvotedBy = [...feedback.upvotedBy];
      let newDownvotedBy = [...feedback.downvotedBy];
      let newUpvotes = feedback.upvotes;
      let newDownvotes = feedback.downvotes;
      
      if (hasDownvoted) {
        newDownvotes -= 1;
        newDownvotedBy = newDownvotedBy.filter(uid => uid !== userId);
      } else {
        newDownvotes += 1;
        newDownvotedBy.push(userId);
        
        if (hasUpvoted) {
          newUpvotes -= 1;
          newUpvotedBy = newUpvotedBy.filter(uid => uid !== userId);
        }
      }
      
      const netVotes = newUpvotes - newDownvotes;
      
      await this.update(id, {
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        upvotedBy: newUpvotedBy,
        downvotedBy: newDownvotedBy,
        votes: netVotes
      });
      
      return await this.getById(id);
    } catch (error) {
      console.error("Error downvoting feedback:", error?.message || error);
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      await this.update(id, { status });
      return await this.getById(id);
    } catch (error) {
      console.error("Error updating feedback status:", error?.message || error);
      throw error;
    }
  },

  async getComments(feedbackId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('comment_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "author_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "feedback_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [
          {
            "FieldName": "feedback_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(feedbackId)]
          }
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(comment => ({
        Id: comment.Id,
        author: comment.author_c || 'Anonymous User',
        content: comment.content_c || '',
        createdAt: comment.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching comments:", error?.message || error);
      return [];
    }
  },

  async addComment(feedbackId, commentData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('comment_c', {
        records: [
          {
            Name: `Comment on ${feedbackId}`,
            author_c: commentData.author || 'Anonymous User',
            content_c: commentData.content,
            feedback_id_c: parseInt(feedbackId)
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
          console.error(`Failed to add comment: ${JSON.stringify(failed)}`);
          throw new Error(failed[0].message || 'Failed to add comment');
        }
        
        if (successful.length > 0) {
          const comment = successful[0].data;
          return {
            Id: comment.Id,
            author: comment.author_c || 'Anonymous User',
            content: comment.content_c || '',
            createdAt: comment.CreatedOn
          };
        }
      }
    } catch (error) {
      console.error("Error adding comment:", error?.message || error);
      throw error;
    }
  }
};