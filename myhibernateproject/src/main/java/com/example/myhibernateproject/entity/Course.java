package com.example.myhibernateproject.entity;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "course")
public class Course {
	@Override
	public String toString() {
		return "Course [courseId=" + courseId + ", Professor=" + professor + ", Price=" + "$"+price + ", Title=" + title
				+ ", Description=" + description + ",Total Lecture="+lectures.size()+"]";
	}
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long courseId;
	private String professor;
	private int price;
	private String title;
	private String description;
	
	public Course() {
		ratings=new ArrayList<Integer>();
		lectures=new ArrayList<Lecture>();
		users=new HashSet<User>();
	}

	public Course(long courseId, String professor, int price, String title, String description) {
		this.courseId = courseId;
		this.professor = professor;
		this.price = price;
		this.title = title;
		this.description = description;
	}
	
	@ElementCollection(fetch=FetchType.EAGER)
	private List<Integer> ratings;
	
	@ManyToMany(mappedBy="courses",fetch=FetchType.EAGER,cascade=CascadeType.ALL)
    private Set<User> users;
	
	@OneToMany(mappedBy="course",cascade=CascadeType.ALL,fetch=FetchType.EAGER)
	private List<Lecture> lectures;
	

	public List<Integer> getRatings() {
		return ratings;
	}
	public void setRatings(List<Integer> ratings) {
		this.ratings = ratings;
	}
	
	public List<Lecture> getLectures() {
		return lectures;
	}
	public void setLectures(List<Lecture> lectures) {
		this.lectures = lectures;
	}
	
	public long getCourseId() {
		return courseId;
	}

	
	public void setCourseId(long courseId) {
		this.courseId = courseId;
	}

	public String getProfessor() {
		return professor;
	}

	public void setProfessor(String professor) {
		this.professor = professor;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

}
