package y2015.src.test.kotlin.y2015

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import y2015.*
import java.io.File

class day11Test {
    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun test1() {
        assertEquals("ab", day11Increment("aa"));
    }

    @Test
    fun test2() {
        assertEquals("ba", day11Increment("az"));
    }

    @Test
    fun test3() {
        assertEquals("raa", day11Increment("qzz"));
    }

    @Test
    fun test4() {
        assertEquals(false, day11IsValid("hijklmmn"));
    }

    @Test
    fun test5() {
        assertEquals(false, day11IsValid("abbceffg"));
    }

    @Test
    fun test6() {
        assertEquals(false, day11IsValid("abbcegjk"));
    }

    @Test
    fun test7() {
        assertEquals(true, day11IsValid("ghjaabcc"));
    }

    @Test
    fun test8() {
        assertEquals("abcdffaa", day11("abcdefgh"));
    }

    @Test
    fun test9() {
        assertEquals("ghjaabcc", day11("ghijklmn"));
    }

    @Test
    fun testActual() {
        assertEquals("cqjxxyzz", day11("cqjxjnds"))
    }

    @Test
    fun testActualSecond() {
        assertEquals("cqkaabcc", day11("cqjxxyzz"))
    }
}

