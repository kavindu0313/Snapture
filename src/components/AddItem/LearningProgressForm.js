import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./LearningProgressForm.css";

// Learning progress templates
const progressTemplates = [
  {
    id: "tutorial_completion",
    name: "Tutorial Completion",
    fields: ["tutorialName", "platform", "skillsLearned", "completionDate"]
  },
  {
    id: "new_skill",
    name: "New Skill Acquired",
    fields: ["title", "content", "skillName", "proficiencyLevel", "learningResources", "practiceProjects"]
  },
  {
    id: "course_milestone",
    name: "Course Milestone",
    fields: ["courseName", "milestone", "content", "challengesFaced", "nextSteps"]
  }
];

function LearningProgressForm() {
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tutorialName: "",
        platform: "",
        skillsLearned: [],
        completionDate: "",
        skillName: "",
        proficiencyLevel: "",
        learningResources: [],
        practiceProjects: "",
        courseName: "",
        milestone: "",
        challengesFaced: "",
        nextSteps: ""
    });
    const [skillInput, setSkillInput] = useState("");
    const [resourceInput, setResourceInput] = useState("");
    const [postImage, setPostImage] = useState(null);
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
            alert("Please login to create a learning progress update");
            navigate("/login");
            return;
        }
        
        setUserId(currentUserId);
        setUsername(userFullName || "Anonymous");
    }, [navigate]);

    const handleTemplateChange = (e) => {
        const templateId = e.target.value;
        setSelectedTemplate(templateId);
        
        // Reset form errors when template changes
        setErrors({});
        setTouched({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Mark field as touched
        setTouched({ ...touched, [name]: true });
        
        // Validate on change
        validateField(name, value);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setPostImage(e.target.files[0]);
            validateField("imageUrl", e.target.files[0]);
        }
    };

    const handleAddSkill = () => {
        if (skillInput.trim() !== "") {
            setFormData({
                ...formData,
                skillsLearned: [...formData.skillsLearned, skillInput.trim()]
            });
            setSkillInput("");
        }
    };

    const handleRemoveSkill = (index) => {
        const updatedSkills = [...formData.skillsLearned];
        updatedSkills.splice(index, 1);
        setFormData({
            ...formData,
            skillsLearned: updatedSkills
        });
    };

    const handleAddResource = () => {
        if (resourceInput.trim() !== "") {
            setFormData({
                ...formData,
                learningResources: [...formData.learningResources, resourceInput.trim()]
            });
            setResourceInput("");
        }
    };

    const handleRemoveResource = (index) => {
        const updatedResources = [...formData.learningResources];
        updatedResources.splice(index, 1);
        setFormData({
            ...formData,
            learningResources: updatedResources
        });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        validateField(name, value);
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
                
            case 'content':
                if (!value || value.trim() === "") {
                    newErrors.content = 'Content is required';
                } else {
                    delete newErrors.content;
                }
                break;
                
            case 'tutorialName':
                if (selectedTemplate === 'tutorial_completion' && (!value || value.trim() === "")) {
                    newErrors.tutorialName = 'Tutorial name is required';
                } else {
                    delete newErrors.tutorialName;
                }
                break;
                
            case 'platform':
                if (selectedTemplate === 'tutorial_completion' && (!value || value.trim() === "")) {
                    newErrors.platform = 'Platform is required';
                } else {
                    delete newErrors.platform;
                }
                break;
                
            case 'skillName':
                if (selectedTemplate === 'new_skill' && (!value || value.trim() === "")) {
                    newErrors.skillName = 'Skill name is required';
                } else {
                    delete newErrors.skillName;
                }
                break;
                
            case 'courseName':
                if (selectedTemplate === 'course_milestone' && (!value || value.trim() === "")) {
                    newErrors.courseName = 'Course name is required';
                } else {
                    delete newErrors.courseName;
                }
                break;
                
            case 'milestone':
                if (selectedTemplate === 'course_milestone' && (!value || value.trim() === "")) {
                    newErrors.milestone = 'Milestone is required';
                } else {
                    delete newErrors.milestone;
                }
                break;
                
            case 'imageUrl':
                if (value) {
                    // Check file type
                    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
                    if (!acceptedTypes.includes(value.type)) {
                        newErrors.imageUrl = 'Only JPG, PNG, and GIF images are allowed';
                    } else if (value.size > 5 * 1024 * 1024) { // 5MB limit
                        newErrors.imageUrl = 'Image size should be less than 5MB';
                    } else {
                        delete newErrors.imageUrl;
                    }
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
        
        // Common fields validation
        if (!formData.title || formData.title.trim() === "") {
            newErrors.title = 'Title is required';
            newTouched.title = true;
            isValid = false;
        }
        
        if (!formData.content || formData.content.trim() === "") {
            newErrors.content = 'Content is required';
            newTouched.content = true;
            isValid = false;
        }
        
        // Template-specific validation
        if (selectedTemplate === 'tutorial_completion') {
            if (!formData.tutorialName || formData.tutorialName.trim() === "") {
                newErrors.tutorialName = 'Tutorial name is required';
                newTouched.tutorialName = true;
                isValid = false;
            }
            
            if (!formData.platform || formData.platform.trim() === "") {
                newErrors.platform = 'Platform is required';
                newTouched.platform = true;
                isValid = false;
            }
        } else if (selectedTemplate === 'new_skill') {
            if (!formData.skillName || formData.skillName.trim() === "") {
                newErrors.skillName = 'Skill name is required';
                newTouched.skillName = true;
                isValid = false;
            }
        } else if (selectedTemplate === 'course_milestone') {
            if (!formData.courseName || formData.courseName.trim() === "") {
                newErrors.courseName = 'Course name is required';
                newTouched.courseName = true;
                isValid = false;
            }
            
            if (!formData.milestone || formData.milestone.trim() === "") {
                newErrors.milestone = 'Milestone is required';
                newTouched.milestone = true;
                isValid = false;
            }
        }
        
        setErrors(newErrors);
        setTouched(newTouched);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedTemplate) {
            alert("Please select a template");
            return;
        }
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const formData = new FormData();
            
            // Create post data object based on the selected template
            const postData = {
                title: formData.title,
                content: formData.content,
                userId: userId,
                username: username,
                postType: "learning_progress",
                template: selectedTemplate
            };
            
            // Add template-specific fields
            if (selectedTemplate === 'tutorial_completion') {
                postData.tutorialName = formData.tutorialName;
                postData.platform = formData.platform;
                postData.skillsLearned = formData.skillsLearned;
                postData.completionDate = formData.completionDate;
            } else if (selectedTemplate === 'new_skill') {
                postData.skillName = formData.skillName;
                postData.proficiencyLevel = formData.proficiencyLevel;
                postData.learningResources = formData.learningResources;
                postData.practiceProjects = formData.practiceProjects;
            } else if (selectedTemplate === 'course_milestone') {
                postData.courseName = formData.courseName;
                postData.milestone = formData.milestone;
                postData.challengesFaced = formData.challengesFaced;
                postData.nextSteps = formData.nextSteps;
            }
            
            // Add post data to FormData
            formData.append("postDetails", JSON.stringify(postData));
            
            // Add image if selected
            if (postImage) {
                formData.append("file", postImage);
            }
            
            // Send request to create learning progress post
            const response = await axios.post(
                "http://localhost:8080/posts/learning-progress/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            
            alert("Learning progress update posted successfully!");
            navigate("/posts/learning-progress");
            
        } catch (error) {
            console.error("Error creating learning progress post:", error);
            alert("Error creating learning progress post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderTemplateFields = () => {
        if (!selectedTemplate) return null;
        
        switch (selectedTemplate) {
            case 'tutorial_completion':
                return (
                    <>
                        <div className="form-group">
                            <label htmlFor="tutorialName">Tutorial Name*</label>
                            <input
                                type="text"
                                id="tutorialName"
                                name="tutorialName"
                                value={formData.tutorialName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.tutorialName && errors.tutorialName ? 'input-error' : ''}
                                placeholder="Enter tutorial name"
                            />
                            {touched.tutorialName && errors.tutorialName && <span className="error-message">{errors.tutorialName}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="platform">Platform*</label>
                            <input
                                type="text"
                                id="platform"
                                name="platform"
                                value={formData.platform}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.platform && errors.platform ? 'input-error' : ''}
                                placeholder="Enter platform (e.g., Udemy, YouTube, Coursera)"
                            />
                            {touched.platform && errors.platform && <span className="error-message">{errors.platform}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="skillsLearned">Skills Learned</label>
                            <div className="input-with-button">
                                <input
                                    type="text"
                                    id="skillInput"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    placeholder="Enter a skill"
                                />
                                <button type="button" onClick={handleAddSkill} className="add-btn">Add</button>
                            </div>
                            
                            {formData.skillsLearned.length > 0 && (
                                <div className="tags-container">
                                    {formData.skillsLearned.map((skill, index) => (
                                        <div key={index} className="tag">
                                            {skill}
                                            <button type="button" onClick={() => handleRemoveSkill(index)} className="remove-tag">×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="completionDate">Completion Date</label>
                            <input
                                type="date"
                                id="completionDate"
                                name="completionDate"
                                value={formData.completionDate}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                );
                
            case 'new_skill':
                return (
                    <>
                        <div className="form-group">
                            <label htmlFor="skillName">Skill Name*</label>
                            <input
                                type="text"
                                id="skillName"
                                name="skillName"
                                value={formData.skillName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.skillName && errors.skillName ? 'input-error' : ''}
                                placeholder="Enter skill name"
                            />
                            {touched.skillName && errors.skillName && <span className="error-message">{errors.skillName}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="proficiencyLevel">Proficiency Level</label>
                            <select
                                id="proficiencyLevel"
                                name="proficiencyLevel"
                                value={formData.proficiencyLevel}
                                onChange={handleChange}
                            >
                                <option value="">Select proficiency level</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="learningResources">Learning Resources</label>
                            <div className="input-with-button">
                                <input
                                    type="text"
                                    id="resourceInput"
                                    value={resourceInput}
                                    onChange={(e) => setResourceInput(e.target.value)}
                                    placeholder="Enter a resource"
                                />
                                <button type="button" onClick={handleAddResource} className="add-btn">Add</button>
                            </div>
                            
                            {formData.learningResources.length > 0 && (
                                <div className="tags-container">
                                    {formData.learningResources.map((resource, index) => (
                                        <div key={index} className="tag">
                                            {resource}
                                            <button type="button" onClick={() => handleRemoveResource(index)} className="remove-tag">×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="practiceProjects">Practice Projects</label>
                            <textarea
                                id="practiceProjects"
                                name="practiceProjects"
                                value={formData.practiceProjects}
                                onChange={handleChange}
                                placeholder="Describe any projects you've created to practice this skill"
                                rows="3"
                            ></textarea>
                        </div>
                    </>
                );
                
            case 'course_milestone':
                return (
                    <>
                        <div className="form-group">
                            <label htmlFor="courseName">Course Name*</label>
                            <input
                                type="text"
                                id="courseName"
                                name="courseName"
                                value={formData.courseName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.courseName && errors.courseName ? 'input-error' : ''}
                                placeholder="Enter course name"
                            />
                            {touched.courseName && errors.courseName && <span className="error-message">{errors.courseName}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="milestone">Milestone*</label>
                            <input
                                type="text"
                                id="milestone"
                                name="milestone"
                                value={formData.milestone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.milestone && errors.milestone ? 'input-error' : ''}
                                placeholder="Enter milestone (e.g., 'Completed Module 3', 'Passed Midterm')"
                            />
                            {touched.milestone && errors.milestone && <span className="error-message">{errors.milestone}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="challengesFaced">Challenges Faced</label>
                            <textarea
                                id="challengesFaced"
                                name="challengesFaced"
                                value={formData.challengesFaced}
                                onChange={handleChange}
                                placeholder="Describe any challenges you faced"
                                rows="3"
                            ></textarea>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="nextSteps">Next Steps</label>
                            <textarea
                                id="nextSteps"
                                name="nextSteps"
                                value={formData.nextSteps}
                                onChange={handleChange}
                                placeholder="Describe your next steps in this course"
                                rows="3"
                            ></textarea>
                        </div>
                    </>
                );
                
            default:
                return null;
        }
    };

    return (
        <div className="learning-progress-container">
            <div className="learning-progress-card">
                <h1>Share Your Learning Progress</h1>
                
                <form onSubmit={handleSubmit} className="learning-progress-form">
                    <div className="form-group">
                        <label htmlFor="template">Select Template*</label>
                        <select
                            id="template"
                            value={selectedTemplate}
                            onChange={handleTemplateChange}
                            className={!selectedTemplate ? 'input-error' : ''}
                        >
                            <option value="">Select a template</option>
                            {progressTemplates.map(template => (
                                <option key={template.id} value={template.id}>
                                    {template.name}
                                </option>
                            ))}
                        </select>
                        {!selectedTemplate && <span className="error-message">Please select a template</span>}
                    </div>
                    
                    {selectedTemplate && (
                        <>
                            <div className="form-group">
                                <label htmlFor="title">Title*</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.title && errors.title ? 'input-error' : ''}
                                    placeholder="Enter a title for your progress update"
                                />
                                {touched.title && errors.title && <span className="error-message">{errors.title}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="content">Description*</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={touched.content && errors.content ? 'input-error' : ''}
                                    placeholder="Describe your learning progress"
                                    rows="4"
                                ></textarea>
                                {touched.content && errors.content && <span className="error-message">{errors.content}</span>}
                            </div>
                            
                            {renderTemplateFields()}
                            
                            <div className="form-group">
                                <label htmlFor="postImage">Upload Image (Optional)</label>
                                <input
                                    type="file"
                                    id="postImage"
                                    name="postImage"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className={touched.imageUrl && errors.imageUrl ? 'input-error' : ''}
                                />
                                {touched.imageUrl && errors.imageUrl && <span className="error-message">{errors.imageUrl}</span>}
                                
                                {postImage && (
                                    <div className="image-preview">
                                        <img 
                                            src={URL.createObjectURL(postImage)} 
                                            alt="Preview" 
                                            className="preview-image"
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={isSubmitting || !selectedTemplate}
                    >
                        {isSubmitting ? "Posting..." : "Share Progress"}
                    </button>
                </form>
                
                <div className="navigation-links">
                    <Link to="/posts" className="nav-link">View All Posts</Link>
                    <Link to="/posts/learning-progress" className="nav-link">View Learning Progress</Link>
                    <Link to="/home" className="nav-link">Back to Home</Link>
                </div>
            </div>
        </div>
    );
}

export default LearningProgressForm;
