import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import './App.css';
import axiosInstance from './interceptor';

export function Task() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duedate: ''
    });
    const navigate = useNavigate();
    const [fetchData, setFetchData] = useState([]);

    const updateFormData = (field, value) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: value
        }));
    };

    const [formErrors, setFormErrors] = useState({
        title: '',
        description: '',
        duedate: ''
    });

    const validateForm = () => {
        let valid = true;
        const newFormErrors = { ...formErrors };

        if (formData.title.trim() === '') {
            newFormErrors.title = "Title is required";
            valid = false;
        }
        if (formData.description.trim() === '') {
            newFormErrors.description = "Description is required";
            valid = false;
        }
        if (!formData.duedate) {
            newFormErrors.duedate = "Due date is required";
            valid = false;
        }
        setFormErrors(newFormErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
                try {
                    const result = await axiosInstance.post('task/addtask',formData
                    );
                    console.log(result);
                    fetchUpdatedData();
                } catch (err) {
                    console.error('Error in token authentication', err);
                }
        }
    };

    const fetchUpdatedData = async () => {
        try {
            const response = await axiosInstance.get('/task/retrieve');
            setFetchData(response.data);
            console.log(response.data);
            setFormData({
                title: '',
                description: '',
                duedate: ''
            });
        } catch (err) {
            console.error('Error fetching updated data', err);
        }
    };
    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/task/delete/${id}`);
            fetchUpdatedData();
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };
    const handleStatus = async(id,status) => {

        try{
            await axiosInstance.put(`/task/update/${id}/${status}`,null);
            console.log("updated");
            fetchUpdatedData();
        }
        catch{
            console.log('error hitting');
        }
    };
    useEffect(() => {
        fetchUpdatedData();
    }, []);

    

    return (
        <div>

            <h1 className = "left-margin" style={{ color: "blue" }}>Tasks</h1><br /><br />
            <div className='App'>

            <div className='container'>
                <h5>Title
                    <Form.Control
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateFormData("title", e.target.value)}
                        placeholder='Enter the title'
                    />
                </h5>
                <span style={{ color: "red" }}>{formErrors.title}</span>
            </div><br />

            <div className='container'>
                <h5>Description
                    <Form.Control
                        id="description"
                        type="text"
                        value={formData.description}
                        onChange={(e) => updateFormData("description", e.target.value)}
                        placeholder='Enter the description'
                    />
                </h5>
                <span style={{ color: "red" }}>{formErrors.description}</span>
            </div><br />

            <div className='container'>
                <h5>Due Date
                    <Form.Control
                        id="duedate"
                        type="Date"
                        value={formData.duedate}
                        onChange={(e) => updateFormData("duedate", e.target.value)}
                        placeholder='Enter the due date'
                    />
                </h5>
                <span style={{ color: "red" }}>{formErrors.duedate}</span>
            </div><br />

            <br />

            <button className="btn btn-success" onClick={handleSubmit}>Add</button><br /><br />

            <div>
                <h3>Updated Tasks</h3><br />

                <table className="table">
                    <thead>
                        <tr>
                          
                            <th className="th">Title</th>
                            <th className="th">Description</th>
                            <th className="th">Date</th>
                            <th className="th">Due Date</th>
                            <th className="th">Status</th>
                            <th className="th">Delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Array.isArray(fetchData) && fetchData.length > 0 ? (
                            fetchData.map((item) => (
                                <tr key={item.Id}>
                                    <td className="td">{item.Title}</td>
                                    <td className="td">{item.Description}</td>
                                    <td className="td">{item.Date}</td>
                                    <td className="td">{item.Duedate}</td>
                                    <td className="td">
                                        <button className="btn btn-primary" onClick={() => handleStatus(item.Id, item.status)}>{item.status}</button>
                                    </td>
                                    <td className="td">
                                        <button className="btn btn-danger" onClick={() => handleDelete(item.Id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No tasks found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div><br />
            <button className="btn btn-success" onClick={() => navigate('/home')}>Home</button><br /><br />
            </div>
        </div>
    );
}
