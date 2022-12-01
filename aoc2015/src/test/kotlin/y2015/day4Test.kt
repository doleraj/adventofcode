package y2015.src.test.kotlin.y2015

import org.junit.Assert.*
import org.junit.Test
import y2015.day4
import y2015.day4Second
import java.io.File

class day4Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals(609043, day4("abcdef"))
    }

    @Test
    fun test2() {
        assertEquals(1048970, day4("pqrstuv"))
    }

    @Test
    fun testActual() {
        assertEquals(346386, day4("iwrupvqb"))
    }

    @Test
    fun testActualSecond() {
        assertEquals(9958218, day4Second("iwrupvqb"))
    }
}
