package com.example.myhibernateproject.dao;

import java.awt.Desktop;
import java.net.URI;

import org.hibernate.Session;

import com.example.myhibernateproject.entity.Course;
import com.example.myhibernateproject.entity.Lecture;
import com.example.myhibernateproject.util.HibernateUtil;

public class LectureDao {
	@SuppressWarnings("deprecation")
	public void addLecture(long courseId, String title, String duration, String url) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		Course c = session.get(Course.class, courseId);
		Lecture l = new Lecture(title, duration, url);
		c.getLectures().add(l);
		l.setCourse(c);
		session.saveOrUpdate(c);
		session.getTransaction().commit();
		session.close();
		System.out.println("Lecture added successfully");
	}

	@SuppressWarnings("deprecation")
	public void deleteLecture(long cId, long lId) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		Course c = session.get(Course.class, cId);
		Lecture lc = session.get(Lecture.class, lId);
		boolean isUpdated = false;
		for (Lecture l : c.getLectures()) {
			if (l.getLectureId() == lId) {
				c.getLectures().remove(l);
				isUpdated = true;
				break;
			}
		}
		if (isUpdated) {
			session.delete(lc);
			session.saveOrUpdate(c);

		} else
			System.out.println("Something went wrong");

		session.getTransaction().commit();
		session.close();
		System.out.println("Lecture deleted successfully");
	}

	public void viewLecture(Course c, long lecId) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		Lecture l = session.get(Lecture.class, lecId);
		boolean isPresent = false;
		for (Lecture lec : c.getLectures()) {
			if (l.getLectureId() == lec.getLectureId()) {
				isPresent = true;
				break;
			}

		}
		if (!isPresent) {
			System.out.println("Wrong lecture id!!");
			session.getTransaction().commit();
			session.close();
			return;
		}
		try {
			Desktop.getDesktop().browse(new URI(l.getUrl()));
			Thread.sleep(2000);
		} catch (Exception e) {
			e.printStackTrace();
		}
		session.getTransaction().commit();
		session.close();

	}

	@SuppressWarnings("deprecation")
	public void updateLectures(long cId, long lId, String title, String duration, String url) {
		Session session = HibernateUtil.getSessionFactory().openSession();
		session.beginTransaction();
		Course c = session.get(Course.class, cId);
		Lecture lc = session.get(Lecture.class, lId);
		boolean isUpdated = false;
		for (Lecture l : c.getLectures()) {
			if (l.getLectureId() == lId) {
				c.getLectures().remove(lc);
				session.delete(l);
				Lecture nLc = new Lecture(title, duration, url);
				c.getLectures().add(nLc);
				nLc.setCourse(c);
				isUpdated = true;
				break;
			}
		}
		if (isUpdated) {
			session.saveOrUpdate(c);
		} else
			System.out.println("Something went wrong");

		session.getTransaction().commit();
		session.close();
		System.out.println("Lecture updated successfully");

	}

}
