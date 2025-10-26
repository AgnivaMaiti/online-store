import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategory.trim() }])
        .select()
        .single();

      if (error) throw error;
      
      setCategories([...categories, data]);
      setNewCategory('');
      setError(null);
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id) => {
    if (!editName.trim()) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('categories')
        .update({ name: editName.trim() })
        .eq('id', id);

      if (error) throw error;
      
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, name: editName.trim() } : cat
      ));
      setEditingCategory(null);
      setEditName('');
      setError(null);
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? This cannot be undone.')) return;

    try {
      setLoading(true);
      // First, check if any products are using this category
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('category_id', id);

      if (products && products.length > 0) {
        throw new Error('Cannot delete category: There are products associated with it');
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCategories(categories.filter(cat => cat.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (category) => {
    setEditingCategory(category.id);
    setEditName(category.name);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditName('');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-container">
      <h2>Manage Categories</h2>
      
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      
      <div className="card mb-4">
        <div className="card-header">
          <h3>Add New Category</h3>
        </div>
        <div className="card-body">
          <form onSubmit={addCategory} className="form-inline">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary ml-2" disabled={!newCategory.trim()}>
              Add Category
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Existing Categories</h3>
        </div>
        <div className="card-body">
          {categories.length === 0 ? (
            <p>No categories found. Add your first category above.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        {editingCategory === category.id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') updateCategory(category.id);
                              if (e.key === 'Escape') cancelEditing();
                            }}
                            autoFocus
                          />
                        ) : (
                          category.name
                        )}
                      </td>
                      <td>
                        {editingCategory === category.id ? (
                          <>
                            <button 
                              className="btn btn-sm btn-success mr-2"
                              onClick={() => updateCategory(category.id)}
                              disabled={!editName.trim()}
                            >
                              Save
                            </button>
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={cancelEditing}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className="btn btn-sm btn-primary mr-2"
                              onClick={() => startEditing(category)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteCategory(category.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
