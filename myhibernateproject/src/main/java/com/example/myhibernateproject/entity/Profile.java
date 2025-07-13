package com.example.myhibernateproject.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "profile")
public class Profile {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long profileId;
	private String name;
	private int age;
	private String mob_no;
	private String branch;
	private String address;
	private String email;
	private int coursesCount;
	@OneToOne(mappedBy = "profile")
	private User user;
	
	
	public User getUser() {
		return user;
	}


	@Override
	public String toString() {
		return "Profile [Name=" + name + ", Age=" + age + ", Mobile Number=" + mob_no + ", Branch=" + branch + ", Address="
				+ address + ", Email=" + email + ", Courses Purchased=" + coursesCount + "]";
	}

	public String displayEducatorProfile() {
		return "Profile [Name=" + name + ", Age=" + age + ", Mobile Number=" + mob_no + ", Address="
				+ address + ", Email=" + email + ", Courses Published=" + coursesCount + "]";
	}
	public void setUser(User user) {
		this.user = user;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public void setMob_no(String mob_no) {
		this.mob_no = mob_no;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public int getCoursesCount() {
		return coursesCount;
	}

	public void setCoursesCount(int coursesCount) {
		this.coursesCount = coursesCount;
	}

}
