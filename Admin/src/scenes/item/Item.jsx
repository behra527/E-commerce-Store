import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Card, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const itemDB = 'https://dexter-e4919-default-rtdb.firebaseio.com/item';
const categoryDB = 'https://dexter-e4919-default-rtdb.firebaseio.com/categories';

function Item() {
  const [items, setItems] = useState({});
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => {
    axios.get(`${itemDB}.json`).then(res => setItems(res.data || {}));
    axios.get(`${categoryDB}.json`).then(res => setCategories(res.data || {}));
  }, []);

  // Category add/edit
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const category = {
      name: form.name.value,
      image: form.image.value,
    };

    if (editCategory) {
      await axios.put(`${categoryDB}/${editCategory.id}.json`, category);
      Swal.fire('Updated!', 'Category updated.', 'success');
    } else {
      await axios.post(`${categoryDB}.json`, category);
      Swal.fire('Added!', 'Category added.', 'success');
    }

    setEditCategory(null);
    setShowCategoryModal(false);
    const res = await axios.get(`${categoryDB}.json`);
    setCategories(res.data || {});
  };

  // Delete category
  const handleCategoryDelete = async (id, name) => {
    const confirm = await Swal.fire({
      title: 'Delete this category?',
      text: 'All related items will still stay.',
      icon: 'warning',
      showCancelButton: true,
    });
    if (confirm.isConfirmed) {
      await axios.delete(`${categoryDB}/${id}.json`);
      if (selectedCategory === name) setSelectedCategory(null);
      const res = await axios.get(`${categoryDB}.json`);
      setCategories(res.data || {});
    }
  };

  // Item add/edit
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const item = {
      name: form.name.value,
      category: selectedCategory,
      price: parseFloat(form.price.value),
      mainImage: form.mainImage.value,
      gallery: form.gallery.value.split(',').map(url => url.trim()).filter(Boolean),
      description: form.description.value,
      colors: form.colors.value.split(',').map(c => c.trim()).filter(Boolean),
    };

    if (editItem) {
      await axios.put(`${itemDB}/${editItem.id}.json`, item);
      Swal.fire('Updated!', 'Item updated.', 'success');
    } else {
      await axios.post(`${itemDB}.json`, item);
      Swal.fire('Added!', 'Item added.', 'success');
    }

    setEditItem(null);
    setShowItemModal(false);
    const res = await axios.get(`${itemDB}.json`);
    setItems(res.data || {});
  };

  // Delete item
  const handleItemDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this item?',
      icon: 'warning',
      showCancelButton: true,
    });
    if (confirm.isConfirmed) {
      await axios.delete(`${itemDB}/${id}.json`);
      const res = await axios.get(`${itemDB}.json`);
      setItems(res.data || {});
    }
  };

  const categoryList = Object.entries(categories).map(([id, cat]) => ({ id, ...cat }));
  const filteredItems = Object.entries(items).filter(([_, item]) => item.category === selectedCategory);

  return (
    <div className="container mt-4">
      {/* Categories Section */}
      <div className="d-flex justify-content-between mb-3">
        <h3>🛍️ Manage Categories</h3>
        <Button onClick={() => setShowCategoryModal(true)}>+ Add Category</Button>
      </div>

      <div className="row">
        {categoryList.map(cat => (
          <div className="col-md-3 mb-3" key={cat.id}>
            <Card
              className={`h-100 shadow-sm ${selectedCategory === cat.name ? 'border-primary border-3' : ''}`}
              onClick={() => setSelectedCategory(cat.name)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Img variant="top" src={cat.image} style={{ height: 140, objectFit: 'cover' }} />
              <Card.Body className="d-flex justify-content-between align-items-center">
                <Card.Title className="m-0 fs-6">{cat.name}</Card.Title>
                <div>
                  <Button
                    size="sm"
                    variant="outline-warning"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditCategory(cat);
                      setShowCategoryModal(true);
                    }}
                  >✏️</Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    className="ms-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryDelete(cat.id, cat.name);
                    }}
                  >🗑️</Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* Items Section */}
      {selectedCategory && (
        <>
          <div className="d-flex justify-content-between mt-4 mb-2">
            <h4>Items in "{selectedCategory}"</h4>
            <Button onClick={() => setShowItemModal(true)}>+ Add Item</Button>
          </div>

          <div className="row">
            {filteredItems.length > 0 ? filteredItems.map(([id, item]) => (
              <div className="col-md-4 mb-4" key={id}>
                <Card className="h-100 shadow-sm">
                  <Card.Img variant="top" src={item.mainImage} style={{ height: 180, objectFit: 'cover' }} />
                  <Card.Body>
                    <h5>{item.name}</h5>
                    <p className="small text-muted">{item.description}</p>
                    <p>
                      {item.oldPrice && <del className="text-danger me-2">£{item.oldPrice}</del>}
                      <span className="text-success fw-bold">£{item.price}</span>
                    </p>
                    <div className="d-flex flex-wrap gap-1 mb-2">
                      {item.gallery?.map((img, i) => (
                        <img key={i} src={img} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                      ))}
                    </div>
                    <div className="mb-2">
                      {item.colors?.map((color, i) => (
                        <Badge key={i} bg="secondary" className="me-1">{color}</Badge>
                      ))}
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <Button size="sm" variant="warning" onClick={() => {
                        setEditItem({ ...item, id });
                        setShowItemModal(true);
                      }}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleItemDelete(id)}>Delete</Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )) : <p className="text-muted ms-3">No items found.</p>}
          </div>
        </>
      )}

      {/* Category Modal */}
      <Modal show={showCategoryModal} onHide={() => { setShowCategoryModal(false); setEditCategory(null); }}>
        <Form onSubmit={handleCategorySubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editCategory ? 'Edit' : 'Add'} Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" defaultValue={editCategory?.name || ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control name="image" defaultValue={editCategory?.image || ''} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowCategoryModal(false); setEditCategory(null); }}>Cancel</Button>
            <Button type="submit" variant="primary">{editCategory ? 'Update' : 'Add'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Item Modal */}
      <Modal show={showItemModal} onHide={() => { setShowItemModal(false); setEditItem(null); }}>
        <Form onSubmit={handleItemSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editItem ? 'Edit' : 'Add'} Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" defaultValue={editItem?.name || ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" step="0.01" name="price" defaultValue={editItem?.price || ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Main Image URL</Form.Label>
              <Form.Control name="mainImage" defaultValue={editItem?.mainImage || ''} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gallery Image URLs (comma-separated)</Form.Label>
              <Form.Control name="gallery" defaultValue={editItem?.gallery?.join(', ') || ''} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Colors (comma-separated)</Form.Label>
              <Form.Control name="colors" defaultValue={editItem?.colors?.join(', ') || ''} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" defaultValue={editItem?.description || ''} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowItemModal(false); setEditItem(null); }}>Cancel</Button>
            <Button type="submit" variant="primary">{editItem ? 'Update' : 'Add'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Item;
// yrr item images store hn into base 64 and user can select picture from local pc