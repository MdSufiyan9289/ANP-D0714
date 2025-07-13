package com.example.myhibernateproject.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "lecture")
public class Lecture {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long lectureId;
	private String lectureTitle;
	private String duration;
	private String url;
	
	@ManyToOne
	@JoinColumn(name="courseId")
	private Course course;
	
	@Override
	public String toString() {
		return "Lecture [Id="+lectureId+", Title=" + lectureTitle + ", Duration=" + duration + "]";
	}
	public Course getCourse() {
		return course;
	}
	public void setCourse(Course course) {
		this.course = course;
	}
	public Lecture() {}
	public Lecture(String lectureTitle, String duration, String url) {
		super();
		this.lectureTitle = lectureTitle;
		this.duration = duration;
		this.url = url;
	}
	
	public long getLectureId() {
		return lectureId;
	}
	public void setLectureId(long lectureId) {
		this.lectureId = lectureId;
	}
	public String getLectureTitle() {
		return lectureTitle;
	}
	public void setLectureTitle(String lectureTitle) {
		this.lectureTitle = lectureTitle;
	}
	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
}
