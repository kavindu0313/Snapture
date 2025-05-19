import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./LearningPlanForm.css";

function LearningPlanForm() {
    const { planId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!planId;
    
    const [plan, setPlan] = useState({
        title: "",
        description: "",
        goalDescription: "",
        targetCompletionDate: "",
        isPublic: true,
        status: "In Progress",
        topics: [],
        resources: [],
        milestones: []
    });
    
    const [topicInput, setTopicInput] = useState("");
    const [resourceInputs, setResourceInputs] = useState({
        resourceName: "",
        resourceUrl: "",
        resourceType: "Website"
    });
    const [milestoneInputs, setMilestoneInputs] = useState({
        milestoneName: "",
        description: "",
        targetDate: ""
    });
    
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        // Check if user is logged in
        const currentUserId = localStorage.getItem("userId");
        const userFullName = localStorage.getItem("userFullName");
        
        if (!currentUserId) {
            alert("Please login to create a learning plan");
            navigate("/login");
            return;
        }
        
        setUserId(currentUserId);
        setUsername(userFullName || "Anonymous");
        
        // If in edit mode, load the existing plan
        if (isEditMode) {
            loadPlan();
        }
    }, [isEditMode, planId, navigate]);

    const loadPlan = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/learning-plans/${planId}`);
            const planData = response.data;
            
            // Check if the current user is the owner of this plan
            if (planData.userId !== userId && userId !== "") {
                alert("You don't have permission to edit this learning plan");
                navigate("/learning-plans");
                return;
            }
            
            setPlan(planData);
        } catch (err) {
            console.error("Error loading learning plan:", err);
            alert("Failed to load learning plan. It may have been deleted or doesn't exist.");
            navigate("/learning-plans");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPlan({
            ...plan,
            [name]: type === 'checkbox' ? checked : value
        });
        
        // Mark field as touched
        setTouched({ ...touched, [name]: true });
        
        // Validate on change
        validateField(name, type === 'checkbox' ? checked : value);
    };

    const handleTopicInputChange = (e) => {
        setTopicInput(e.target.value);
    };

    const handleAddTopic = () => {
        if (topicInput.trim() === "") {
            return;
        }
        
        setPlan({
            ...plan,
            topics: [...plan.topics, topicInput.trim()]
        });
        setTopicInput("");
    };

    const handleRemoveTopic = (index) => {
        const updatedTopics = [...plan.topics];
        updatedTopics.splice(index, 1);
        setPlan({
            ...plan,
            topics: updatedTopics
        });
    };

    const handleResourceInputChange = (e) => {
        const { name, value } = e.target;
        setResourceInputs({
            ...resourceInputs,
            [name]: value
        });
    };

    const handleAddResource = () => {
        if (resourceInputs.resourceName.trim() === "") {
            return;
        }
        
        setPlan({
            ...plan,
            resources: [
                ...plan.resources,
                {
                    ...resourceInputs,
                    completed: false
                }
            ]
        });
        
        // Reset resource inputs
        setResourceInputs({
            resourceName: "",
            resourceUrl: "",
            resourceType: "Website"
        });
    };

    const handleRemoveResource = (index) => {
        const updatedResources = [...plan.resources];
        updatedResources.splice(index, 1);
        setPlan({
            ...plan,
            resources: updatedResources
        });
    };

    const handleMilestoneInputChange = (e) => {
        const { name, value } = e.target;
        setMilestoneInputs({
            ...milestoneInputs,
            [name]: value
        });
    };

    const handleAddMilestone = () => {
        if (milestoneInputs.milestoneName.trim() === "") {
            return;
        }
        
        setPlan({
            ...plan,
            milestones: [
                ...plan.milestones,
                {
                    ...milestoneInputs,
                    completed: false
                }
            ]
        });
        
        // Reset milestone inputs
        setMilestoneInputs({
            milestoneName: "",
            description: "",
            targetDate: ""
        });
    };

    const handleRemoveMilestone = (index) => {
        const updatedMilestones = [...plan.milestones];
        updatedMilestones.splice(index, 1);
        setPlan({
            ...plan,
            milestones: updatedMilestones
        });
    };

    const handleBlur = (e) => {
        const { name, value, type, checked } = e.target;
        setTouched({ ...touched, [name]: true });
        validateField(name, type === 'checkbox' ? checked : value);
    };

    const validateField = (name, value) => {
        let newErrors = { ...errors };
        
        switch (name) {
            case 'title':
                if (!value || value.trim() === "") {
                    newErrors.title = 'Title is required';
                } else if (value.length < 3) {
                    newErrors.title = 'Title must be at least 3 characters';
                } else {
                    delete newErrors.title;
                }
                break;
                
            case 'description':
                if (!value || value.trim() === "") {
                    newErrors.description = 'Description is required';
                } else {
                    delete newErrors.description;
                }
                break;
                
            case 'goalDescription':
                if (!value || value.trim() === "") {
                    newErrors.goalDescription = 'Goal description is required';
                } else {
                    delete newErrors.goalDescription;
                }
                break;
                
            default:
                break;
        }
        
        setErrors(newErrors);
    };

    const validateForm = () => {
        let isValid = true;
        let newErrors = {};
        let newTouched = { ...touched };
        
        // Validate required fields
        if (!plan.title || plan.title.trim() === "") {
            newErrors.title = 'Title is required';
            newTouched.title = true;
            isValid = false;
        }
        
        if (!plan.description || plan.description.trim() === "") {
            newErrors.description = 'Description is required';
            newTouched.description = true;
            isValid = false;
        }
        
        if (!plan.goalDescription || plan.goalDescription.trim() === "") {
            newErrors.goalDescription = 'Goal description is required';
            newTouched.goalDescription = true;
            isValid = false;
        }
        
        setErrors(newErrors);
        setTouched(newTouched);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Prepare the plan data
            const planData = {
                ...plan,
                userId: userId,
                username: username
            };
            
            let response;
            
            if (isEditMode) {
                // Update existing plan
                response = await axios.put(`http://localhost:8080/learning-plans/${planId}`, planData);
                alert("Learning plan updated successfully!");
            } else {
                // Create new plan
                response = await axios.post("http://localhost:8080/learning-plans", planData);
                alert("Learning plan created successfully!");
            }
            
            navigate(`/learning-plans/${response.data.planId}`);
            
        } catch (error) {
            console.error("Error saving learning plan:", error);
            alert("Error saving learning plan. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="learning-plan-form-container">
            <div className="learning-plan-form-card">
                <h1>{isEditMode ? "Edit Learning Plan" : "Create Learning Plan"}</h1>
                
                <form onSubmit={handleSubmit} className="learning-plan-form">
                    <div className="form-section">
                        <h2>Basic Information</h2>
                        
                        <div className="form-group">
                            <label htmlFor="title">Title*</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={plan.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.title && errors.title ? 'input-error' : ''}
                                placeholder="Enter a title for your learning plan"
                            />
                            {touched.title && errors.title && <span className="error-message">{errors.title}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="description">Description*</label>
                            <textarea
                                id="description"
                                name="description"
                                value={plan.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.description && errors.description ? 'input-error' : ''}
                                placeholder="Describe your learning plan"
                                rows="3"
                            ></textarea>
                            {touched.description && errors.description && <span className="error-message">{errors.description}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="goalDescription">Learning Goal*</label>
                            <textarea
                                id="goalDescription"
                                name="goalDescription"
                                value={plan.goalDescription}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.goalDescription && errors.goalDescription ? 'input-error' : ''}
                                placeholder="What do you want to achieve with this learning plan?"
                                rows="3"
                            ></textarea>
                            {touched.goalDescription && errors.goalDescription && <span className="error-message">{errors.goalDescription}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="targetCompletionDate">Target Completion Date</label>
                            <input
                                type="date"
                                id="targetCompletionDate"
                                name="targetCompletionDate"
                                value={plan.targetCompletionDate || ''}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isPublic"
                                    checked={plan.isPublic}
                                    onChange={handleChange}
                                />
                                Make this plan public
                            </label>
                            <p className="form-hint">Public plans are visible to all users</p>
                        </div>
                        
                        {isEditMode && (
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={plan.status}
                                    onChange={handleChange}
                                >
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Abandoned">Abandoned</option>
                                </select>
                            </div>
                        )}
                    </div>
                    
                    <div className="form-section">
                        <h2>Topics</h2>
                        <p className="section-description">Add topics that you plan to learn</p>
                        
                        <div className="form-group">
                            <div className="input-with-button">
                                <input
                                    type="text"
                                    id="topicInput"
                                    value={topicInput}
                                    onChange={handleTopicInputChange}
                                    placeholder="Enter a topic"
                                />
                                <button type="button" onClick={handleAddTopic} className="add-btn">Add</button>
                            </div>
                        </div>
                        
                        {plan.topics.length > 0 && (
                            <div className="tags-container">
                                {plan.topics.map((topic, index) => (
                                    <div key={index} className="tag">
                                        {topic}
                                        <button type="button" onClick={() => handleRemoveTopic(index)} className="remove-tag">×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="form-section">
                        <h2>Learning Resources</h2>
                        <p className="section-description">Add resources you plan to use</p>
                        
                        <div className="resource-form">
                            <div className="form-group">
                                <label htmlFor="resourceName">Resource Name</label>
                                <input
                                    type="text"
                                    id="resourceName"
                                    name="resourceName"
                                    value={resourceInputs.resourceName}
                                    onChange={handleResourceInputChange}
                                    placeholder="Enter resource name"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="resourceUrl">Resource URL</label>
                                <input
                                    type="text"
                                    id="resourceUrl"
                                    name="resourceUrl"
                                    value={resourceInputs.resourceUrl}
                                    onChange={handleResourceInputChange}
                                    placeholder="Enter resource URL"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="resourceType">Resource Type</label>
                                <select
                                    id="resourceType"
                                    name="resourceType"
                                    value={resourceInputs.resourceType}
                                    onChange={handleResourceInputChange}
                                >
                                    <option value="Website">Website</option>
                                    <option value="Book">Book</option>
                                    <option value="Video">Video</option>
                                    <option value="Course">Course</option>
                                    <option value="Article">Article</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            <button type="button" onClick={handleAddResource} className="add-resource-btn">
                                Add Resource
                            </button>
                        </div>
                        
                        {plan.resources.length > 0 && (
                            <div className="resources-list">
                                <h3>Added Resources</h3>
                                {plan.resources.map((resource, index) => (
                                    <div key={index} className="resource-item">
                                        <div className="resource-info">
                                            <span className="resource-name">{resource.resourceName}</span>
                                            <span className="resource-type">{resource.resourceType}</span>
                                            {resource.resourceUrl && (
                                                <a href={resource.resourceUrl} target="_blank" rel="noopener noreferrer" className="resource-link">
                                                    View Resource
                                                </a>
                                            )}
                                        </div>
                                        <button type="button" onClick={() => handleRemoveResource(index)} className="remove-btn">
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="form-section">
                        <h2>Milestones</h2>
                        <p className="section-description">Add milestones to track your progress</p>
                        
                        <div className="milestone-form">
                            <div className="form-group">
                                <label htmlFor="milestoneName">Milestone Name</label>
                                <input
                                    type="text"
                                    id="milestoneName"
                                    name="milestoneName"
                                    value={milestoneInputs.milestoneName}
                                    onChange={handleMilestoneInputChange}
                                    placeholder="Enter milestone name"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="milestoneDescription">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={milestoneInputs.description}
                                    onChange={handleMilestoneInputChange}
                                    placeholder="Describe this milestone"
                                    rows="2"
                                ></textarea>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="targetDate">Target Date</label>
                                <input
                                    type="date"
                                    id="targetDate"
                                    name="targetDate"
                                    value={milestoneInputs.targetDate}
                                    onChange={handleMilestoneInputChange}
                                />
                            </div>
                            
                            <button type="button" onClick={handleAddMilestone} className="add-milestone-btn">
                                Add Milestone
                            </button>
                        </div>
                        
                        {plan.milestones.length > 0 && (
                            <div className="milestones-list">
                                <h3>Added Milestones</h3>
                                {plan.milestones.map((milestone, index) => (
                                    <div key={index} className="milestone-item">
                                        <div className="milestone-info">
                                            <span className="milestone-name">{milestone.milestoneName}</span>
                                            {milestone.targetDate && (
                                                <span className="milestone-date">Target: {milestone.targetDate}</span>
                                            )}
                                            {milestone.description && (
                                                <p className="milestone-description">{milestone.description}</p>
                                            )}
                                        </div>
                                        <button type="button" onClick={() => handleRemoveMilestone(index)} className="remove-btn">
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : isEditMode ? "Update Plan" : "Create Plan"}
                    </button>
                </form>
                
                <div className="navigation-links">
                    <Link to="/learning-plans" className="nav-link">View All Learning Plans</Link>
                    <Link to="/home" className="nav-link">Back to Home</Link>
                </div>
            </div>
        </div>
    );
}

export default LearningPlanForm;
