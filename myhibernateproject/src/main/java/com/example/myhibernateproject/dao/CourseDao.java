package com.example.myhibernateproject.dao;

import java.util.List;
import java.util.Set;

import org.hibernate.Session;
import org.hibernate.query.Query;

import com.example.myhibernateproject.entity.Course;
import com.example.myhibernateproject.entity.Lecture;
import com.example.myhibernateproject.entity.User;
import com.example.myhibernateproject.util.HibernateUtil;

public class CourseDao {
	@SuppressWarnings("deprecation")
	public void addCourse(long userId,String title, String description, int price, String professor, List<Lecture> lectures) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		User u=session.get(User.class, userId);
		Course c = new Course();
		c.setDescription(description);
		c.setPrice(price);
		c.setProfessor(professor);
		c.setTitle(title);
		c.setLectures(lectures);
		for (Lecture l : lectures)
			l.setCourse(c);
		u.getCourses().add(c);
	    u.getProfile().setCoursesCount(u.getProfile().getCoursesCount()+1);
		session.saveOrUpdate(u);
		session.getTransaction().commit();
		session.close();
		System.out.println("Course published successfully");
	}

	@SuppressWarnings("deprecation")
	public void deleteCourse(long courseId) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		Course c = session.get(Course.class, courseId);
		session.delete(c);
		session.getTransaction().commit();
		session.close();
		System.out.println("Course deleted successfully");
	}

	@SuppressWarnings("deprecation")
	public void updateCourse(long courseId, String title, String description, int price, String professor) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		Course c = session.get(Course.class, courseId);
		if (c == null) {
			System.out.println("Invalid course id");
			session.getTransaction().commit();
			session.close();
			return;
		}
		c.setDescription(description);
		c.setPrice(price);
		c.setProfessor(professor);
		c.setTitle(title);
		session.update(c);
		session.getTransaction().commit();
		session.close();
		System.out.println("Course updated successfully");
	}

	
    
	public List<Course> getAllCourses() {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		Query<Course> q = session.createQuery("from Course", Course.class);
		List<Course> list = q.getResultList();
		return list;
	}

	public void purcahseCourse(long userId, long courseId) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		User student = session.get(User.class, userId);
		Course course = session.get(Course.class, courseId);
		if(course==null) {
			System.out.println("Invalid course Id");
			return;
		}
		student.getProfile().setCoursesCount(student.getProfile().getCoursesCount()+1);
		student.getCourses().add(course);
		course.getUsers().add(student);
		session.getTransaction().commit();
		session.close();
		System.out.println("Course added successfully");
	}

	@SuppressWarnings("deprecation")
	public void addRatings(long cId, int ratings,long uId) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		User user=session.get(User.class, uId);
		Course course = session.get(Course.class, cId);
		boolean isPresent=false;
		for(Course c:user.getCourses()) {
			if(c.getCourseId()==cId) {
				isPresent=true;
				break;
			}
		}
		if(!isPresent) {
			System.out.println("Course not found for this Id");
			session.getTransaction().commit();
			session.close();
			return;
		}
		course.getRatings().add(ratings);
		session.saveOrUpdate(course);
		session.getTransaction().commit();
		session.close();
		System.out.println("Ratings added successfully");
	}
	
	public Set<Course> getAllUserCourses(long userId) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		User u=session.get(User.class, userId);
		session.getTransaction().commit();
		session.close();
		return u.getCourses();
	}
	
	public Course getCourse(long id) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		Course c=session.get(Course.class, id);
		if(c==null) {
			System.out.println("Invalid course Id");
			return null;
		}
		session.getTransaction().commit();
		session.close();
		return c;
	}
}
