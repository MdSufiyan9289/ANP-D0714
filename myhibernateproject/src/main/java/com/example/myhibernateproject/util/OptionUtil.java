package com.example.myhibernateproject.util;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;

import com.example.myhibernateproject.dao.AuthDao;
import com.example.myhibernateproject.dao.CourseDao;
import com.example.myhibernateproject.dao.LectureDao;
import com.example.myhibernateproject.dao.ProfileDao;
import com.example.myhibernateproject.dao.UserDao;
import com.example.myhibernateproject.entity.Course;
import com.example.myhibernateproject.entity.Lecture;
import com.example.myhibernateproject.entity.User;

public class OptionUtil {
	public void loginPage(Scanner sc) {
		AuthDao authDao = new AuthDao();
		while (true) {
			System.out.println(
					"\n1.Signup as a User\n2.Login as User\n3.Signup as an Educator\n4.Login as an Educator \n5.Exit");
			System.out.println("Enter your choice:");
			int choice = sc.nextInt();
			sc.nextLine();
			switch (choice) {
			case 1:
				System.out.println("Enter your name:");
				String name = sc.nextLine();
				System.out.println("Enter your email:");
				String email = sc.nextLine();
				System.out.println("Enter your password:");
				String password = sc.nextLine();
				User u1 = authDao.userSignup(name, email, password, false);
				if (u1 != null)
					userHomePageOptions(sc, u1);
				break;
			case 2:
				System.out.println("Enter your email:");
				String email1 = sc.nextLine();
				System.out.println("Enter your password:");
				String password1 = sc.nextLine();
				User u2 = authDao.userLogin(email1, password1, false);
				if (u2 != null)
					userHomePageOptions(sc, u2);
				break;
			case 3:
				System.out.println("Enter your name:");
				String name2 = sc.nextLine();
				System.out.println("Enter your email:");
				String email3 = sc.nextLine();
				System.out.println("Enter your password:");
				String password3 = sc.nextLine();
				User u3 = authDao.userSignup(name2, email3, password3, true);
				if (u3 != null)
					userHomePageOptions(sc, u3);
				break;
			case 4:
				System.out.println("Enter your email:");
				String email4 = sc.nextLine();
				System.out.println("Enter your password:");
				String password4 = sc.nextLine();
				User u4 = authDao.userLogin(email4, password4, true);
				if (u4 != null)
					userHomePageOptions(sc, u4);
				break;
			default:
				System.exit(0);
			}
		}
	}

	private void userHomePageOptions(Scanner sc, User u) {
		System.out.println();
		System.out.println(u.isEducator() ? "Educator" : "User");
		System.out.println("Name-" + u.getName());
		System.out.println("Email-" + u.getEmail());
		while (true) {
			System.out.println("\n1.Your profile\n2.Course Section\n3.Your Account\n4.Login page\n5.Exit ");
			System.out.println("Enter your choice:");
			int choice = sc.nextInt();
			sc.nextLine();
			switch (choice) {
			case 1:
				profileOptions(sc, u);
				break;
			case 2:
				courseOptions(sc, u);
				break;
			case 3:
				accountOptions(sc, u);
				break;
			case 4:
				return;
			default:
				System.exit(0);
			}
		}
	}

	private void profileOptions(Scanner sc, User u) {
		ProfileDao pDao = new ProfileDao();
		System.out.println();
		System.out.println(u.isEducator() ? "Educator" : "User");
		System.out.println("Name-" + u.getName());
		System.out.println("Email-" + u.getEmail());
		while (true) {
			System.out.println("\n1.View profile\n2.Update profile \n3.Return to Home page\n4.Exit ");
			System.out.println("Enter your choice:");
			int choice = sc.nextInt();
			sc.nextLine();
			switch (choice) {
			case 1:
				pDao.viewProfile(u.getUserId());
				break;
			case 2:
				System.out.println("Enter your name:");
				String name = sc.nextLine();
				System.out.println("Enter your age:");
				int age = sc.nextInt();
				sc.nextLine();
				System.out.println("Enter your Mobile number:");
				String mob_no = sc.nextLine();
				String branch = null;
				if (!u.isEducator()) {
					System.out.println("Enter your branch:");
					branch = sc.nextLine();
				}
				System.out.println("Enter your address:");
				String address = sc.nextLine();
				pDao.updateProfile(u.getUserId(), name, age, mob_no, branch, address);
				u.setName(name);
				break;
			case 3:
				return;
			default:
				System.exit(0);
			}
		}
	}

	private void courseOptions(Scanner sc, User u) {
		CourseDao cDao = new CourseDao();
		System.out.println();
		System.out.println(u.isEducator() ? "Educator" : "User");
		System.out.println("Name-" + u.getName());
		System.out.println("Email-" + u.getEmail());
		String message = "\n1.Your Courses\n2.All available Courses\n3.Purchase a Course\n4.Continue Watching a Course\n5.Add Ratings to a Course\n6.Return to Home page\n7.Exit ";
		String message2 = "\n1.Your Courses\n2.Publish a Course\n3.Update a Course\n4.Lecture Section\n5.Show Users details\n6.Return to Home page\n7.Exit";
		while (true) {
			System.out.println(u.isEducator() ? message2 : message);
			System.out.println("Enter your choice:");
			int choice = sc.nextInt();
			sc.nextLine();
			switch (choice) {
			case 1:
				Set<Course> courses = cDao.getAllUserCourses(u.getUserId());
				if (courses.isEmpty()) {
					String work = u.isEducator() ? "Published" : "Purchased";
					System.out.println("No course " + work + " yet");
					break;
				}
				if (u.isEducator()) 
					showEducatorCourses(courses);
				else 
					showUsersCourses(courses);
				
				break;
			case 2:
				if (!u.isEducator()) {
					List<Course> allCourses=cDao.getAllCourses();
					if(allCourses.isEmpty())
						System.out.println("No Courses Available");
					else 
						for (Course course : allCourses)
							System.out.println(course);	
				} 
				else 
					publishCourse(u.getUserId(),cDao,sc);
				break;
			case 3:
				if(cDao.getAllCourses().isEmpty()) {
					System.out.println("No Course Available");
					break;
				}
				if (!u.isEducator()) {
					System.out.println("Enter course id:");
					long cId = sc.nextLong();
					sc.nextLine();
					Course c=cDao.getCourse(cId);
					if(initiatePayment(c,sc))
						cDao.purcahseCourse(u.getUserId(), cId);
				} 
				else 
					updateCourse(cDao,sc);
				break;
				
			case 4:
				Set<Course> courses2 = cDao.getAllUserCourses(u.getUserId());
				if (courses2.isEmpty()) {
					String work = u.isEducator() ? "Published" : "Purchased";
					System.out.println("No course " + work + " yet");
					break;
				}
				if(u.isEducator())
					lectureOptions(sc,u);
				else
					watchCourse(sc,cDao,new LectureDao());
				break;
			case 5:
				Set<Course> crs=cDao.getAllUserCourses(u.getUserId());
				if(crs.isEmpty()) {
					String work = u.isEducator() ? "Published" : "Purchased";
					System.out.println("No Course "+work);
					break;
				}
				if (u.isEducator()) {
					for (Course course : crs) {
						Set<User> users=getEnrolledUsers(course.getUsers());
						if(users.isEmpty()) 
							System.out.println("Course Id = "+course.getCourseId()+", Course Name = "+course.getTitle()+", Users Enrolled = No user enrolled in this course yet.");
						else 
							for (User user : users) 
								System.out.println("Course Id = "+course.getCourseId()+", Course Name = "+course.getTitle()+", User Name = "+user.getName()+", Course Status = Pending");
					}
				} else {
					System.out.println("Enter course id:");
					long courseId = sc.nextLong();
					System.out.println("Enter ratings (0 to 5):");
					int ratings = sc.nextInt();
					if (ratings > 5 || ratings < 0)
						System.out.println("Range must be between 0 to 5");
					else
						cDao.addRatings(courseId, ratings,u.getUserId());
				}
				break;
			case 6:
				return;

			default:
				System.exit(0);
			}
		}
	}
	private boolean initiatePayment(Course c,Scanner sc) {
		System.out.println("To buy this course, you have to pay $"+c.getPrice());
		System.out.println("Do you want to make the payment of $"+c.getPrice()+" (Yes/No):");
		String ans=sc.nextLine();
		if(ans.equalsIgnoreCase("no")||ans.equalsIgnoreCase("n"))
			return false;
		else if(ans.equalsIgnoreCase("yes")||ans.equalsIgnoreCase("y")) {
			System.out.println(c.getPrice()+"$ has been deducted from your account.");
			return true;
		}
		else {
			System.out.println("Please answer either yes(y) or no(n):");
			return false;
		}
	}
	private void updateCourse(CourseDao dao,Scanner sc) {
		System.out.println("Enter course id:");
		long courseId = sc.nextLong();
		sc.nextLine();
		System.out.println("Enter new course title:");
		String title = sc.nextLine();
		System.out.println("Enter new course description:");
		String desc = sc.nextLine();
		System.out.println("Enter new course price:");
		int price = sc.nextInt();
		sc.nextLine();
		System.out.println("Enter new course professor:");
		String professor = sc.nextLine();
		dao.updateCourse(courseId, title, desc, price, professor);
	}
	private void publishCourse(long id,CourseDao dao,Scanner sc) {
		System.out.println("Enter course title:");
		String title = sc.nextLine();
		System.out.println("Enter course description:");
		String desc = sc.nextLine();
		System.out.println("Enter course price(in dollar):");
		int price = sc.nextInt();
		sc.nextLine();
		System.out.println("Enter course professor:");
		String professor = sc.nextLine();

		List<Lecture> lectures = new ArrayList<Lecture>();
		for (int i = 1; i < Integer.MAX_VALUE; i++) {

			System.out.println("Enter the details of lecture " + i);
			System.out.println("Enter lecture title:");
			String lectureTitle = sc.nextLine();
			System.out.println("Enter lecture duration(in minutes):");
			String duration = sc.nextLine();
			System.out.println("Enter lecture url:");
			String url = sc.nextLine();
			lectures.add(new Lecture(lectureTitle, duration, url));

			System.out.println("Do you want to add more lecture (Y/N):");
			String c = sc.nextLine();
			c = c.toUpperCase();
			if (c.equals("N"))
				break;
		}
		dao.addCourse(id, title, desc, price, professor, lectures);
	}
	
	
	private void showEducatorCourses(Set<Course> courses) {
		double revenue = 0.0;
		for (Course course : courses) {
			int courseRevenue=course.getPrice() * getEnrolledUsers(course.getUsers()).size();
			revenue += courseRevenue;
			double avgRatings = 0.0;
			for (int i = 0; i < course.getRatings().size(); i++) 
				avgRatings += course.getRatings().get(i);						
			avgRatings /= course.getRatings().size();
			String msg = "| Course Id = " + course.getCourseId() + ", Course Title = "
					+ course.getTitle() + ", Course Professor = " + course.getProfessor()
					+ ", Course Price = $" + course.getPrice() + ", No of Lectures = "
					+ course.getLectures().size() + ", No of Users Enrolled = "
					+ getEnrolledUsers(course.getUsers()).size() + ", Revenue Generated = $"
					+ courseRevenue + ", Course Ratings = " + Math.round(avgRatings*10.0)/10.0
					+ " |";
			System.out.println(msg);
		}
		System.out.println();
		System.out.println("Total revenue generated=$" + revenue);
	}
	private void showUsersCourses(Set<Course> courses) {
		System.out.println("\nTotal courses purchased=" + courses.size()+"\n");
		for(Course course:courses) 
			System.out.println("Course Id = "+course.getCourseId()+"\nCourse Name = "+course.getTitle()+"\nCourse Professor = "+course.getProfessor()+"\nCourse Description = "+course.getDescription()+"\nTotal Lectures in this course = "+course.getLectures().size());
	}
	
	private void watchCourse(Scanner sc,CourseDao dao,LectureDao lDao) {
		System.out.println("Enter course id:");
		long courseId=sc.nextLong();
		int i=1;
		Course c=dao.getCourse(courseId);
		System.out.println("\nCourse name :-"+c.getTitle());
		System.out.println();
		System.out.println("All available lectures:-\n");
		for(Lecture l:c.getLectures()) {
			System.out.println(i+"."+l);
			i++;
		}		
		System.out.println("\nEnter the lecture id to be watched:");
		long lectureId=sc.nextLong();
		lDao.viewLecture(c,lectureId);
	}
	
	
	private long showAllLectures(long courseId,Scanner sc,CourseDao dao) {
		Course c=dao.getCourse(courseId);
		System.out.println("All available lecture ids");
		for(Lecture l:c.getLectures()) 
			System.out.println(l.getLectureId());
		System.out.println("Enter lecture id to be updated:");
		long lId=sc.nextLong();
		sc.nextLine();
		return lId; 	
	}
    private Set<User> getEnrolledUsers(Set<User> users) {
        Set<User> us=new HashSet<User>();
        for(User user:users) 
        	if(!user.isEducator())
        		us.add(user);
        return us;
    }
	private void accountOptions(Scanner sc, User u) {
		UserDao uDao = new UserDao();
		AuthDao aDao = new AuthDao();
		System.out.println();
		System.out.println(u.isEducator() ? "Educator" : "User");
		System.out.println("Name-" + u.getName());
		System.out.println("Email-" + u.getEmail());
		while (true) {
			System.out.println("\n1.Change password\n2.Delete your account\n3.Return to Home page\n4.Exit ");
			System.out.println("Enter your choice:");
			int choice = sc.nextInt();
			sc.nextLine();
			switch (choice) {
			case 1:
				System.out.println("Enter your email");
				String email = sc.nextLine();
				System.out.println("Enter your old password");
				String oldPassword = sc.nextLine();
				System.out.println("Enter your new password");
				String newPassword = sc.nextLine();
				if (aDao.changePassword(email, oldPassword, newPassword)) {
					loginPage(sc);
				}
				System.exit(0);
			case 2:
				uDao.deleteUser(u.getUserId());
				System.exit(0);
			case 3:
				return;
			default:
				System.exit(0);
			}
		}
	}
	
	private void lectureOptions(Scanner sc,User u) {
		LectureDao lDao = new LectureDao();
		CourseDao cDao=new CourseDao();
		System.out.println();
		System.out.println(u.isEducator() ? "Educator" : "User");
		System.out.println("Name-" + u.getName());
		System.out.println("Email-" + u.getEmail());
		while (true) {
			System.out.println("\n1.View Lectures of a Course\n2.Add a new Lecture into a Course\n3.Delete a Lecture\n4.Update a Lecture\n5.Return to Course Section\n6.Exit ");
			System.out.println("Enter your choice:");
			int choice = sc.nextInt();
			sc.nextLine();
			switch (choice) {
			case 1:
				System.out.println("Enter course Id:");
				long courseId=sc.nextLong();
				Course crs=cDao.getCourse(courseId);
				System.out.println("\nAll available lectures:-");
				for(Lecture l:crs.getLectures())
					System.out.println(l);
				
				break;
			case 2:
				System.out.println("Enter course Id:");
				long courseId2=sc.nextLong();
				sc.nextLine();
				System.out.println("Enter lecture title:");
				String title=sc.nextLine();
				System.out.println("Enter lecture duration(in minutes):");
				String duration=sc.nextLine();
				System.out.println("Enter lecture url:");
				String url=sc.nextLine();
				lDao.addLecture(courseId2, title, duration, url);
				break;
			case 3:
				System.out.println("Enter course Id:");
				long courseId3=sc.nextLong();
				long lecId=showAllLectures(courseId3,sc,cDao);
				System.out.println("Are you sure you want to delete (Y/N):");
				String ans=sc.nextLine();
				if(ans.equalsIgnoreCase("y"))
					lDao.deleteLecture(courseId3, lecId);
				else if(ans.equalsIgnoreCase("n"))
					System.out.println("You cancelled the deletion");
				else
					System.out.println("Wrong input..");
				break;
				
			case 4:
				System.out.println("Enter course Id:");
				long courseId4=sc.nextLong();
				long lecId2=showAllLectures(courseId4,sc,cDao);
				System.out.println("Enter new lecture title:");
				String title2=sc.nextLine();
				System.out.println("Enter lecture duration:");
				String duration2=sc.nextLine();
				System.out.println("Enter lecture url:");
				String url2=sc.nextLine();
				lDao.updateLectures(courseId4, lecId2, title2, duration2, url2);
				break;
			case 5:
				return;
			default:
				System.exit(0);
			}
		}
	}

}
